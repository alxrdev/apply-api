import { Router } from 'express'

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

const jobsController = new JobsController(listJobsUseCase, showJobUseCase, createJobUseCase, updateJobUseCase, deleteJobUseCase)
const jobsGeolocationController = new JobsGeolocationController(findJobsByGeolocation)

const routes = Router()

routes.get('/jobs', jobsController.index)
routes.get('/jobs/:id', jobsController.show)
routes.get('/jobs/:zipcode/:distance', jobsGeolocationController.index)
routes.post('/jobs', jobsController.create)
routes.put('/jobs/:id', jobsController.update)
routes.delete('/jobs/:id', jobsController.delete)

export default routes
