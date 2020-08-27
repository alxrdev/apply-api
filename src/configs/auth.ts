import dotenv from 'dotenv'

dotenv.config()

const jwtSecret = process.env.JWT_SECRET || ''
const jwtExpiresTime = process.env.JWT_EXPIRES_TIME || '15d'

interface IAuthProfile {
  jwtSecret: string
  jwtExpiresTime: string
}

export const jwtProfile: IAuthProfile = {
  jwtSecret,
  jwtExpiresTime
}
