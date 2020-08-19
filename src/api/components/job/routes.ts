import { Router } from 'express'

import JobsController from './controllers/JobsController'
import JobsGeolocationController from './controllers/JobsGeolocationController'

const jobsController = new JobsController()
const jobsGeolocationController = new JobsGeolocationController()

const routes = Router()

routes.get('/jobs', jobsController.index)
routes.get('/jobs/:id', jobsController.show)
routes.get('/jobs/:zipcode/:distance', jobsGeolocationController.index)
routes.post('/jobs', jobsController.create)
routes.put('/jobs/:id', jobsController.update)
routes.delete('/jobs/:id', jobsController.delete)

export default routes
