import { Router } from 'express'

import {
  showUserUseCase,
  createUserUseCase,
  authenticateUserUseCase
} from './utils/dependencies'

import UsersController from './controllers/UsersController'
import AuthController from './controllers/AuthController'

const routes = Router()

const usersController = new UsersController(showUserUseCase, createUserUseCase)

routes.get('/users/:idOrEmail', usersController.show)
routes.post('/users', usersController.create)

const authController = new AuthController(authenticateUserUseCase)

routes.post('/auth', authController.create)

export default routes
