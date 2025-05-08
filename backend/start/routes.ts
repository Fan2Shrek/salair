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
    router.delete('/users/:id', [UsersController, 'destroy'])
  })
  .use([middleware.auth(), middleware.admin()])
  .prefix('api')
