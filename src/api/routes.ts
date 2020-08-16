import { Router, Request, Response } from 'express'

const routes = Router()

routes.get('/', (request: Request, response: Response) => {
  return response.send('Hello World')
})

export default routes
