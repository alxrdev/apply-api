import mongoose from 'mongoose'

import { mongoDbConnectionURI } from '@configs/database'

const mongoDbConnection = async () => {
  return mongoose.connect(mongoDbConnectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
}

export default mongoDbConnection
