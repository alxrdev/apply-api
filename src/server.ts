import dotenv from 'dotenv'
import mongoDbConnection from './services/mongodb'
import App from './api/app'

dotenv.config()

mongoDbConnection()
  .then(conn => console.log(`MongoDB database connected with host: ${conn.connection.host}`))
  .catch(err => console.log(err))

const app = new App()
const server = app.getServer()
const port = process.env.PORT || 3000

server.listen(port, () => console.log(`The server is running in the port ${port}`))
