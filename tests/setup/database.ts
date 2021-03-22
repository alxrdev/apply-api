import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongodb = new MongoMemoryServer()

const openConnection = async () => {
  const uri = await mongodb.getUri()

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
}

const closeConnection = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongodb.stop()
}

const clearDatabase = async () => {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany({})
  }
}

export {
  openConnection,
  closeConnection,
  clearDatabase
}
