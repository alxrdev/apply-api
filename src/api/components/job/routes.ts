import { Router } from 'express'

import JobsController from './controllers/JobsController'
import JobsGeolocationController from './controllers/JobsGeolocationController'

const jobsController = new JobsController()
const jobsGeolocationController = new JobsGeolocationController()

const routes = Router()

routes.get('/jobs', jobsController.index)
routes.get('/jobs/:zipcode/:distance', jobsGeolocationController.index)
routes.post('/jobs', jobsController.create)
routes.put('/jobs', jobsController.update)

export default routes
