import { Router } from 'express'

import jobRoutes from './components/job/routes'
import userRoutes from './components/user/routes'

const routes = Router()

routes.use(userRoutes)
routes.use(jobRoutes)

export default routes
