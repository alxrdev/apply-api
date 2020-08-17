import { Router } from 'express'

import jobRoutes from './components/job/routes'

const routes = Router()

routes.use(jobRoutes)

export default routes
