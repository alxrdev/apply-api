import { container } from 'tsyringe'
import { Router } from 'express'
import { isAuthenticated, authorizedRole } from '../../middlewares/auth'

import fileUpload from '../../middlewares/fileUpload'
import { resumeStorageSettings } from '../../services/storage'

import { JobsController, JobsApplyController, UsersJobsController, UsersJobsAppliedController } from './controllers'

const routes = Router()

const jobsController = container.resolve(JobsController)

routes.get('/jobs', jobsController.index)
routes.get('/jobs/:id', jobsController.show)
routes.post('/jobs', isAuthenticated, authorizedRole('employeer'), jobsController.create)
routes.put('/jobs/:id', isAuthenticated, authorizedRole('employeer'), jobsController.update)
routes.delete('/jobs/:id', isAuthenticated, authorizedRole('employeer'), jobsController.delete)

const jobsApplyController = container.resolve(JobsApplyController)

routes.get('/jobs/:id/users', isAuthenticated, authorizedRole('employeer'), jobsApplyController.index)
routes.get('/jobs/:id/users/:userId', isAuthenticated, authorizedRole('employeer'), jobsApplyController.show)
routes.post('/jobs/:id/apply', isAuthenticated, authorizedRole('user'), fileUpload(resumeStorageSettings).single('resume'), jobsApplyController.create)

const usersJobsAppliedController = container.resolve(UsersJobsAppliedController)

routes.get('/users/:id/jobs/applied', isAuthenticated, authorizedRole('user'), usersJobsAppliedController.index)

const usersJobsController = container.resolve(UsersJobsController)

routes.get('/users/:id/jobs', usersJobsController.index)

export default routes
