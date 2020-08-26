import express, { Express } from 'express'
import routes from './routes'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import apiErrorHandlerMiddleware from '../utils/apiErrorHandlerMiddleware'

class App {
  private server: Express

  constructor () {
    this.server = express()

    this.setupMiddlewares()
    this.setupRoutes()
    this.setupMiddlewaresAfterRoutes()
  }

  public getServer (): Express {
    return this.server
  }

  private setupMiddlewares (): void {
    this.server.use(rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }))

    this.server.use(helmet())

    this.server.use(express.json())
  }

  private setupRoutes (): void {
    this.server.use('/api', routes)
  }

  private setupMiddlewaresAfterRoutes (): void {
    this.server.use(apiErrorHandlerMiddleware)
  }
}

export default App
