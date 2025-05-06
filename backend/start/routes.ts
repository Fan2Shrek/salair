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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    // Authentication routes
    router.post('/register', [AuthController, 'register']).as('auth.register')
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.delete('/logout', [AuthController, 'logout']).as('auth.logout')
    router.get('/me', [AuthController, 'me']).as('auth.me').use(middleware.auth())
    router.post('/refresh', [AuthController, 'refresh']).as('auth.refresh')

    // Plans routes
    router.get('/plans', [PlansController, 'index']).as('plans.index')
  })
  .prefix('/api')
