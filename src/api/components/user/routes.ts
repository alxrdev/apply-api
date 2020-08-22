import { Router } from 'express'

import {
  showUserUseCase,
  createUserUseCase
} from './utils/dependencies'

import UsersController from './controllers/UsersController'

const routes = Router()

const usersController = new UsersController(showUserUseCase, createUserUseCase)

routes.get('/users/:idOrEmail', usersController.show)
routes.post('/users', usersController.create)

export default routes
