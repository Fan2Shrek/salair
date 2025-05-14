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
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UsersController = () => import('#controllers/users_controller')

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
      .as('auth.updateAvatar')
      .use(middleware.auth())
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

// Companies routes
router
  .group(() => {
    router
      .get('/companies', [() => import('#controllers/companies_controller'), 'index'])
      .as('companies.index')
      .use(middleware.admin())
    router
      .get('/companies/:id', [() => import('#controllers/companies_controller'), 'show'])
      .as('companies.show')
    router
      .post('/companies', [() => import('#controllers/companies_controller'), 'store'])
      .as('companies.store')
    router
      .put('/companies/:id', [() => import('#controllers/companies_controller'), 'update'])
      .as('companies.update')
    router
      .delete('/companies/:id', [() => import('#controllers/companies_controller'), 'destroy'])
      .as('companies.destroy')
    router
      .post('/companies/:id/logo', [
        () => import('#controllers/companies_controller'),
        'uploadLogo',
      ])
      .as('companies.uploadLogo')
  })
  .use([middleware.auth()])
  .prefix('api')
