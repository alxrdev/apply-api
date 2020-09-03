import { container } from 'tsyringe'
import { Router } from 'express'

import { AuthController, RefreshTokenController } from './controllers'

const routes = Router()

const authController = container.resolve(AuthController)

routes.post('/auth', authController.create)

const refreshTokenController = container.resolve(RefreshTokenController)

routes.post('/refresh-token', refreshTokenController.post)

export default routes
