import path from 'path'

import express, { Express } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import routes from './routes'
import apiErrorHandlerMiddleware from '@middleware/errorHandler'

class App {
  private server: Express

  constructor () {
    this.server = express()

    this.setupMiddleware()
    this.setupRoutes()
    this.setupMiddlewareAfterRoutes()
  }

  public getServer (): Express {
    return this.server
  }

  private setupMiddleware (): void {
    this.server.use(rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 1000 // limit each IP to 100 requests per windowMs
    }))

    this.server.use(helmet())

    this.server.use(cors({
      origin: function (or, callback) {
        // if ((or && origin.indexOf(or) !== -1) || nodeEnvironment !== 'production') {
        //   return callback(null, true)
        // } else {
        //   return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false)
        // }
        return callback(null, true)
      },
      optionsSuccessStatus: 200,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true
    }))

    this.server.use(cookieParser())

    this.server.use(express.json())
  }

  private setupRoutes (): void {
    this.server.use('/api', routes)

    this.server.use('/api/avatar', express.static(path.resolve(__dirname, '..', 'storage', 'avatars')))
    this.server.use('/api/resume', express.static(path.resolve(__dirname, '..', 'storage', 'resumes')))
  }

  private setupMiddlewareAfterRoutes (): void {
    this.server.use(apiErrorHandlerMiddleware)
  }
}

export default App
