import { container } from 'tsyringe'
import { Router } from 'express'
import { isAuthenticated, authorizedRole } from '../../middlewares/auth'

import UsersController from './controllers/UsersController'
import AuthController from './controllers/AuthController'
import ForgotPasswordController from './controllers/ForgotPasswordController'
import ResetPasswordController from './controllers/ResetPasswordController'

const routes = Router()

const usersController = container.resolve(UsersController)

routes.get('/users/:idOrEmail', usersController.show)
routes.post('/users', usersController.create)
routes.delete('/users/:id', isAuthenticated, authorizedRole(['user', 'employeer']), usersController.delete)

const authController = container.resolve(AuthController)

routes.post('/auth', authController.create)

const forgotPasswordController = container.resolve(ForgotPasswordController)

routes.post('/password/forgot', forgotPasswordController.create)

const resetPasswordController = container.resolve(ResetPasswordController)

routes.post('/password/reset/:token', resetPasswordController.create)

export default routes
