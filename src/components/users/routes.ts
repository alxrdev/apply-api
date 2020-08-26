import { Router } from 'express'

import {
  showUserUseCase,
  createUserUseCase,
  authenticateUserUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  deleteUserUseCase
} from './utils/dependencies'

import UsersController from './controllers/UsersController'
import AuthController from './controllers/AuthController'
import ForgotPasswordController from './controllers/ForgotPasswordController'
import ResetPasswordController from './controllers/ResetPasswordController'
import { isAuthenticated, authorizedRole } from '../../middlewares/auth'

const routes = Router()

const usersController = new UsersController(showUserUseCase, createUserUseCase, deleteUserUseCase)

routes.get('/users/:idOrEmail', usersController.show)
routes.post('/users', usersController.create)
routes.delete('/users/:id', isAuthenticated, authorizedRole(['user', 'employeer']), usersController.delete)

const authController = new AuthController(authenticateUserUseCase)

routes.post('/auth', authController.create)

const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase)

routes.post('/password/forgot', forgotPasswordController.create)

const resetPasswordController = new ResetPasswordController(resetPasswordUseCase)

routes.post('/password/reset/:token', resetPasswordController.create)

export default routes
