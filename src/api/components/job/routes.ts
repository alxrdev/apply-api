import { Router } from 'express'
import isAuthenticated from '../../../utils/isAuthenticatedMiddleware'

import {
  listJobsUseCase,
  showJobUseCase,
  createJobUseCase,
  updateJobUseCase,
  deleteJobUseCase,
  findJobsByGeolocation
} from './utils/dependencies'

import JobsController from './controllers/JobsController'
import JobsGeolocationController from './controllers/JobsGeolocationController'

const routes = Router()

const jobsController = new JobsController(listJobsUseCase, showJobUseCase, createJobUseCase, updateJobUseCase, deleteJobUseCase)

routes.get('/jobs', jobsController.index)
routes.get('/jobs/:id', jobsController.show)
routes.post('/jobs', isAuthenticated, jobsController.create)
routes.put('/jobs/:id', isAuthenticated, jobsController.update)
routes.delete('/jobs/:id', isAuthenticated, jobsController.delete)

const jobsGeolocationController = new JobsGeolocationController(findJobsByGeolocation)

routes.get('/jobs/:zipcode/:distance', jobsGeolocationController.index)

export default routes
