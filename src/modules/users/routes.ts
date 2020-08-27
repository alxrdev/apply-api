import { container } from 'tsyringe'
import { Router } from 'express'

import { isAuthenticated, authorizedRole } from '../../middlewares/auth'
import { avatarStorageSettings } from '../../services/storage'
import fileUpload from '../../middlewares/fileUpload'

import { UsersController, AuthController, ForgotPasswordController, ResetPasswordController, UsersAvatarController } from './controllers'

const routes = Router()

const usersController = container.resolve(UsersController)

routes.get('/users/:idOrEmail', usersController.show)
routes.post('/users', usersController.create)
routes.delete('/users/:id', isAuthenticated, authorizedRole('admin'), usersController.delete)

const usersAvatarController = container.resolve(UsersAvatarController)

routes.put(
  '/users/:id/avatar',
  isAuthenticated,
  authorizedRole(['user', 'employeer']),
  fileUpload(avatarStorageSettings).single('avatar'),
  usersAvatarController.update
)

const authController = container.resolve(AuthController)

routes.post('/auth', authController.create)

const forgotPasswordController = container.resolve(ForgotPasswordController)

routes.post('/password/forgot', forgotPasswordController.create)

const resetPasswordController = container.resolve(ResetPasswordController)

routes.post('/password/reset/:token', resetPasswordController.create)

export default routes
