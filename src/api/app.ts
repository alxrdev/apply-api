import express, { Express } from 'express'
import routes from './routes'

class App {
  private server: Express

  constructor () {
    this.server = express()

    this.setupMiddlewares()
    this.setupRoutes()
  }

  public getServer () : Express {
    return this.server
  }

  private setupMiddlewares () : void {
    this.server.use(express.json())
  }

  private setupRoutes () : void {
    this.server.use('/api', routes)
  }
}

export default App
