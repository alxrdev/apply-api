import { Router } from 'express'

import authRoutes from './modules/auth/routes'
import jobRoutes from './modules/jobs/routes'
import userRoutes from './modules/users/routes'

const routes = Router()

routes.use(authRoutes)
routes.use(userRoutes)
routes.use(jobRoutes)

export default routes
