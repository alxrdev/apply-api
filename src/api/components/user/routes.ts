import { Router } from 'express'

import {
  showUserUseCase,
  createUserUseCase,
  authenticateUserUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase
} from './utils/dependencies'

import UsersController from './controllers/UsersController'
import AuthController from './controllers/AuthController'
import ForgotPasswordController from './controllers/ForgotPasswordController'
import ResetPasswordController from './controllers/ResetPasswordController'

const routes = Router()

const usersController = new UsersController(showUserUseCase, createUserUseCase)

routes.get('/users/:idOrEmail', usersController.show)
routes.post('/users', usersController.create)

const authController = new AuthController(authenticateUserUseCase)

routes.post('/auth', authController.create)

const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase)

routes.post('/password/forgot', forgotPasswordController.create)

const resetPasswordController = new ResetPasswordController(resetPasswordUseCase)

routes.post('/password/reset/:token', resetPasswordController.create)

export default routes
