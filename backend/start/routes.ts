/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const ArticlesAdminController = () => import('#controllers/admin/articles.admin.controller')
const UsersAdminController = () => import('#controllers/admin/users.admin.controller')

const AuthController = () => import('#controllers/auth.controller')
const PlansController = () => import('#controllers/plans.controller')
const CompaniesController = () => import('#controllers/companies.controller')
const InboundMailsController = () => import('#controllers/inbound_mails.controller')
const MeController = () => import('#controllers/me.controller')
const BlogArticlesController = () => import('#controllers/blog_articles.controller')
const CustomersController = () => import('#controllers/customers.controller')
const NewslettersController = () => import('#controllers/newsletter.controller')
const ContactsController = () => import('#controllers/contacts.controller')
const HealthChecksController = () => import('#controllers/health_checks.controller')
const TwoFactorAuthController = () => import('#controllers/two_factor_auth.controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Healthcheck routes
router.get('/api/health', [HealthChecksController])

// Authentication routes
router
  .group(() => {
    router.post('/register', [AuthController, 'register']).as('auth.register')
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.post('/login/verify-2fa', [AuthController, 'verify2fa']).as('auth.login.verify2fa')
    router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
    router.post('/refresh', [AuthController, 'refresh']).as('auth.refresh')
    router.post('/check', [AuthController, 'check']).as('auth.check')

    router.post('/reset-password', [AuthController, 'reset'])
    router.post('/reset-password/verify', [AuthController, 'verifyReset'])
    router.put('/reset-password/update', [AuthController, 'changePasswordAfterReset'])
  })
  .prefix('/api')

// Plans routes
router
  .group(() => {
    router.get('/plans', [PlansController, 'index']).as('plans.index')
  })
  .prefix('/api')

// Me routes (user profile)
router
  .group(() => {
    router.put('/me', [MeController, 'update'])
    router.post('/me/avatar', [MeController, 'updateAvatar'])
    router.get('/me', [MeController, 'me']).as('me.me')
    router.patch('/me/avatar', [MeController, 'updateAvatar']).as('me.update_avatar')

    // 2FA routes - user can only manage their own 2FA
    router.post('/2fa/generate', [TwoFactorAuthController, 'generate'])
    router.post('/2fa/enable', [TwoFactorAuthController, 'enable'])
    router.post('/2fa/disable', [TwoFactorAuthController, 'disable'])
  })
  .use([middleware.auth()])
  .prefix('api')

// Customers routes
router
  .group(() => {
    router.get('/customers', [CustomersController, 'index'])
    router.get('/customers/insights', [CustomersController, 'insights'])
    router.get('/customers/search', [CustomersController, 'search'])
    router.get('/customers/statistics', [CustomersController, 'statistics'])
    router.post('/customers', [CustomersController, 'store'])
    router
      .get('/customers/:id', [CustomersController, 'show'])
      .use(middleware.resourceOwnership({ resourceType: 'customer' }))
    router
      .put('/customers/:id', [CustomersController, 'update'])
      .use(middleware.resourceOwnership({ resourceType: 'customer' }))
    router
      .delete('/customers/:id', [CustomersController, 'destroy'])
      .use(middleware.resourceOwnership({ resourceType: 'customer' }))
    router.post('/customers/enrich', [CustomersController, 'fetchCompany'])
  })
  .prefix('api')
  .use([middleware.auth()])

// Companies routes
router
  .group(() => {
    router
      .get('/companies', [CompaniesController, 'index'])
      .as('companies.index')
      .use(middleware.admin())
    router.get('/companies/search', [CompaniesController, 'search']).use(middleware.admin())
    router.get('/companies/statistics', [CompaniesController, 'statistics']).use(middleware.admin())
    router.get('/companies/my', [CompaniesController, 'getMyCompany'])
    router
      .get('/companies/:id', [CompaniesController, 'show'])
      .as('companies.show')
      .use(middleware.resourceOwnership({ resourceType: 'company' }))
    router.post('/companies', [CompaniesController, 'store']).as('companies.store')
    router
      .put('/companies/:id', [CompaniesController, 'update'])
      .as('companies.update')
      .use(middleware.resourceOwnership({ resourceType: 'company' }))
    router
      .delete('/companies/:id', [CompaniesController, 'destroy'])
      .as('companies.destroy')
      .use(middleware.resourceOwnership({ resourceType: 'company' }))
    router
      .post('/companies/:id/logo', [CompaniesController, 'uploadLogo'])
      .as('companies.uploadLogo')
      .use(middleware.resourceOwnership({ resourceType: 'company' }))
  })
  .use([middleware.auth()])
  .prefix('api')

// Mailgun
router.post('/webhooks/mailgun/inbound', [InboundMailsController, 'receive'])
router
  .group(() => {
    router
      .get('/mails', [InboundMailsController, 'index'])
      .use([middleware.auth(), middleware.admin()])
  })
  .prefix('api')

// Contact routes
router
  .group(() => {
    router.post('/contact', [ContactsController, 'receive'])
  })
  .prefix('api')

// Newsletter routes
router
  .group(() => {
    router
      .get('/newsletter', [NewslettersController, 'index'])
      .use([middleware.auth(), middleware.admin()])
    router.post('/newsletter', [NewslettersController, 'store'])
  })
  .prefix('api')

// Blog articles routes
router
  .group(() => {
    router.get('/blog', [BlogArticlesController, 'index'])
    router.get('/blog/files', [BlogArticlesController, 'files'])
    router.get('/blog/slugs', [BlogArticlesController, 'slugs'])
    router
      .post('/blog/article', [BlogArticlesController, 'store'])
      .use([middleware.auth(), middleware.admin()])
    router.get('/blog/:slug', [BlogArticlesController, 'show'])
  })
  .prefix('api')

/*
 * Admin routes
 */

router
  .group(() => {
    // Articles routes
    router.group(() => {
      router.get('/articles', [ArticlesAdminController, 'index'])
      router.post('/articles', [ArticlesAdminController, 'store'])
      router.put('/articles/:id', [ArticlesAdminController, 'update'])
      router.delete('/articles/:id', [ArticlesAdminController, 'delete'])
    })

    // Users routes - admin only
    router.group(() => {
      router.get('/users', [UsersAdminController, 'index'])
      router.get('/users/:id', [UsersAdminController, 'show'])
      router.post('/users', [UsersAdminController, 'store'])
      router.put('/users/:id', [UsersAdminController, 'update'])
      router.patch('/users/:id/avatar', [UsersAdminController, 'updateAvatar'])
      router.delete('/users/:id', [UsersAdminController, 'destroy'])
      router.post('/users/:id/suspend', [UsersAdminController, 'suspend'])
      router.post('/users/:id/reactivate', [UsersAdminController, 'reactivate'])
    })
  })
  .prefix('api/admin')
  .use([middleware.auth(), middleware.admin()])
