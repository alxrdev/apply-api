import express, { Express } from 'express'
import routes from './routes'
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
