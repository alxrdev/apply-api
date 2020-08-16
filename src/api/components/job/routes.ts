import { Router } from 'express'

import JobsController from './controllers/jobs-controller'

const jobsController = new JobsController()

const routes = Router()

routes.get('/', jobsController.index)

export default routes
