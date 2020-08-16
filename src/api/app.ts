import express, { Express } from 'express'
import routes from './routes'

class App {
  private app: Express

  constructor () {
    this.app = express()

    this.setupMiddlewares()
    this.setupRoutes()
  }

  public getApp () : Express {
    return this.app
  }

  private setupMiddlewares () : void {
    this.app.use(express.json())
  }

  private setupRoutes () : void {
    this.app.use(routes)
  }
}

export default App
