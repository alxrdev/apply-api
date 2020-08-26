import { Router } from 'express'

import jobRoutes from './components/jobs/routes'
import userRoutes from './components/users/routes'

const routes = Router()

routes.use(userRoutes)
routes.use(jobRoutes)

export default routes
