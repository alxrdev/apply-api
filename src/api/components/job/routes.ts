import { Router } from 'express'
import { isAuthenticated, authorizedRole } from '../../../utils/authMiddlewares'
import fileUpload from '../../../utils/fileUpload'
import { diskStorage } from '../../../configs/storage'

import {
  listJobsUseCase,
  showJobUseCase,
  createJobUseCase,
  updateJobUseCase,
  deleteJobUseCase,
  findJobsByGeolocation,
  applyToJobUseCase,
  listJobsAppliedUseCase,
  listPublishedJobsByUserUseCase
} from './utils/dependencies'

import JobsController from './controllers/JobsController'
import JobsGeolocationController from './controllers/JobsGeolocationController'
import JobsApplyController from './controllers/JobsApplyController'
import UserJobsController from './controllers/UserJobsController'

const routes = Router()

const jobsController = new JobsController(listJobsUseCase, showJobUseCase, createJobUseCase, updateJobUseCase, deleteJobUseCase)

routes.get('/jobs', jobsController.index)
routes.get('/jobs/:id', jobsController.show)
routes.post('/jobs', isAuthenticated, authorizedRole('employeer'), jobsController.create)
routes.put('/jobs/:id', isAuthenticated, authorizedRole('employeer'), jobsController.update)
routes.delete('/jobs/:id', isAuthenticated, authorizedRole('employeer'), jobsController.delete)

const jobsGeolocationController = new JobsGeolocationController(findJobsByGeolocation)

routes.get('/jobs/:zipcode/:distance', jobsGeolocationController.index)

const jobsApplyController = new JobsApplyController(listJobsAppliedUseCase, applyToJobUseCase)

routes.get('/users/:id/applied', isAuthenticated, authorizedRole('user'), jobsApplyController.index)
routes.post('/jobs/:id/apply', isAuthenticated, authorizedRole('user'), fileUpload(diskStorage).single('resume'), jobsApplyController.create)

const userJobsController = new UserJobsController(listPublishedJobsByUserUseCase)

routes.get('/users/:id/jobs', userJobsController.index)

export default routes
