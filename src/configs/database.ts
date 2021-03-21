import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

export const mongoDbConnectionURI = process.env.MONGODB_CONNECTION ?? ''
