import { Router } from 'express'

import JobsController from './controllers/JobsController'

const jobsController = new JobsController()

const routes = Router()

routes.get('/jobs', jobsController.index)
routes.post('/jobs', jobsController.create)

export default routes
