import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

export const port = (process.env.PORT) ? Number(process.env.PORT) : 3000
export const host = process.env.HOST || `http://localhost:${port}`
export const nodeEnvironment = process.env.NODE_ENV || 'development'

const originSettings = process.env.ORIGIN || host

export const origin = originSettings.split(',').map(o => o.trim())
