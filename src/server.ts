import App from './api/app'
import dotenv from 'dotenv'

dotenv.config()

const app = new App()
const port = process.env.PORT || 3000

const server = app.getApp()

server.listen(port, () => console.log(`The server is running in the port ${port}`))
