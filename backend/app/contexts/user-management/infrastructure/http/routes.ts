import router from '@adonisjs/core/services/router'
const AuthenticateWithEmailPasswordController = () =>
  import(
    '#contexts/user-management/infrastructure/http/authenticate_with_email_password.controller'
  )

router.post('/login', [AuthenticateWithEmailPasswordController, 'execute'])
