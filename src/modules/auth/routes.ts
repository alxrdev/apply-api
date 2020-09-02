import { container } from 'tsyringe'
import { Router } from 'express'

// import { isAuthenticated, authorizedRole } from '../../middlewares/auth'

import { AuthController } from './controllers'

const routes = Router()

const authController = container.resolve(AuthController)

routes.post('/auth', authController.create)

export default routes
