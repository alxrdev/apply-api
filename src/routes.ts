import { Router } from 'express'

import jobRoutes from './modules/jobs/routes'
import userRoutes from './modules/users/routes'

const routes = Router()

routes.use(userRoutes)
routes.use(jobRoutes)

export default routes
