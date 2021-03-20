import { container } from 'tsyringe'
import { Router } from 'express'

import { AuthController, RefreshTokenController } from './controllers'
import { isAuthenticated } from '@middleware/auth'

const routes = Router()

const authController = container.resolve(AuthController)

routes.post('/auth', authController.create)
routes.get('/me', isAuthenticated, authController.show)

const refreshTokenController = container.resolve(RefreshTokenController)

routes.post('/refresh-token', refreshTokenController.post)

export default routes
