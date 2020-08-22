import { Router } from 'express'

import {
  createUserUseCase
} from './utils/dependencies'

import UsersController from './controllers/UsersController'

const routes = Router()

const usersController = new UsersController(createUserUseCase)

routes.post('/users', usersController.create)

export default routes
