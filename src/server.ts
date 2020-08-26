import dotenv from 'dotenv'
import mongoDbConnection from './services/database/mongodb'
import App from './app'

dotenv.config()

const app = new App()
const port = process.env.PORT || 3000

mongoDbConnection()
  .then(conn => console.log(`MongoDB database connected with host: ${conn.connection.host}`))
  .catch(err => console.log(err))

app
  .getServer()
  .listen(port, () => console.log(`The server is running in the port ${port}`))
