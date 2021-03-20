import { container } from 'tsyringe'
import { Router } from 'express'

import { isAuthenticated, authorizedRole } from '@middleware/auth'
import fileUpload from '@middleware/fileUploader'
import { avatarStorageSettings } from '@providers/storage'

import { UsersController, ForgotPasswordController, ResetPasswordController, UsersAvatarController } from './controllers'

const routes = Router()

const usersController = container.resolve(UsersController)

routes.get('/users/:idOrEmail', usersController.show)
routes.post('/users', usersController.create)
routes.put('/users/:id', isAuthenticated, authorizedRole(['user', 'employer']), usersController.update)
routes.delete('/users/:id', isAuthenticated, authorizedRole('admin'), usersController.delete)

const usersAvatarController = container.resolve(UsersAvatarController)

routes.put(
  '/users/:id/avatar',
  isAuthenticated,
  authorizedRole(['user', 'employer']),
  fileUpload(avatarStorageSettings).single('avatar'),
  usersAvatarController.update
)

const forgotPasswordController = container.resolve(ForgotPasswordController)

routes.post('/password/forgot', forgotPasswordController.create)

const resetPasswordController = container.resolve(ResetPasswordController)

routes.post('/password/reset/:token', resetPasswordController.create)

export default routes
