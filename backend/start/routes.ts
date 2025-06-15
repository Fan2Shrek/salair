/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const ArticlesAdminsController = () => import('#controllers/admin/articles_admins_controller')

const AuthController = () => import('#controllers/auth_controller')
const PlansController = () => import('#controllers/plans_controller')
const UsersController = () => import('#controllers/users_controller')
const CompaniesController = () => import('#controllers/companies_controller')
const InboundMailsController = () => import('#controllers/inbound_mails_controller')
const MeController = () => import('#controllers/me_controller')
const BlogArticlesController = () => import('#controllers/blog_articles_controller')
const NewslettersController = () => import('#controllers/newsletters_controller')
const ContactsController = () => import('#controllers/contacts_controller')
const HealthChecksController = () => import('#controllers/health_checks_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const TwoFactorAuthController = () => import('#controllers/two_factor_auth_controller')

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
    router.get('/me', [AuthController, 'me']).as('auth.me').use(middleware.auth())
    router.post('/refresh', [AuthController, 'refresh']).as('auth.refresh')
    router.post('/check', [AuthController, 'check']).as('auth.check')
    router
      .patch('/me/avatar', [UsersController, 'updateAvatar'])
      .as('auth.update_avatar')
      .use(middleware.auth())

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

// Users routes
router
  .group(() => {
    router.get('/users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.post('/users', [UsersController, 'store'])
    router.put('/users/:id', [UsersController, 'update'])
    router.patch('/users/:id/avatar', [UsersController, 'updateAvatar'])
    router.delete('/users/:id', [UsersController, 'destroy'])
  })
  .use([middleware.auth(), middleware.admin()])
  .prefix('api')

// Users routes for role user
router
  .group(() => {
    router.put('/me', [MeController, 'update'])
    router.post('/me/avatar', [MeController, 'updateAvatar'])

    router.post('/2fa/generate', [TwoFactorAuthController, 'generate'])
    router.post('/2fa/enable', [TwoFactorAuthController, 'enable'])
    router.post('/2fa/disable', [TwoFactorAuthController, 'disable'])
  })
  .use([middleware.auth()])
  .prefix('api')

// Companies routes
router
  .group(() => {
    router
      .get('/companies', [CompaniesController, 'index'])
      .as('companies.index')
      .use(middleware.admin())
    router.get('/companies/:id', [CompaniesController, 'show']).as('companies.show')
    router.post('/companies', [CompaniesController, 'store']).as('companies.store')
    router.put('/companies/:id', [CompaniesController, 'update']).as('companies.update')
    router.delete('/companies/:id', [CompaniesController, 'destroy']).as('companies.destroy')
    router
      .post('/companies/:id/logo', [
        () => import('#controllers/companies_controller'),
        'uploadLogo',
      ])
      .as('companies.uploadLogo')
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
      router.get('/articles', [ArticlesAdminsController, 'index'])
      router.post('/articles', [ArticlesAdminsController, 'store'])
      router.put('/articles/:id', [ArticlesAdminsController, 'update'])
      router.delete('/articles/:id', [ArticlesAdminsController, 'delete'])
    })
  })
  .prefix('api/admin')
  .use([middleware.auth(), middleware.admin()])
