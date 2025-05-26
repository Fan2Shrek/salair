/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const PlansController = () => import('#controllers/plans_controller')
const UsersController = () => import('#controllers/users_controller')
const CompaniesController = () => import('#controllers/companies_controller')
const InboundMailsController = () => import('#controllers/inbound_mails_controller')
const MeController = () => import('#controllers/me_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const NewslettersController = () => import('#controllers/newsletters_controller')
const ContactsController = () => import('#controllers/contacts_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Authentication routes
router
  .group(() => {
    router.post('/register', [AuthController, 'register']).as('auth.register')
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.delete('/logout', [AuthController, 'logout']).as('auth.logout')
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
