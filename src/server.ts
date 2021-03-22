import 'reflect-metadata'
import 'module-alias/register'

import '@providers/container'

import App from './app'
import mongoDbConnection from '@providers/database/mongodb'
import { port } from '@configs/base'

const app = new App()

mongoDbConnection()
  .then(conn => console.log(`MongoDB database connected with host: ${conn.connection.host}`))
  .catch(err => console.log(err))

app
  .getServer()
  .listen(port, () => console.log(`The server is running in the port ${port}`))
