import JwtAuthService from './JwtAuthService'
import { jwtProfile } from '../../configs/auth'
import IAuthSettings from './interfaces/IAuthSettings'

export const authSettings: IAuthSettings = {
  jwtSecret: jwtProfile.jwtSecret,
  jwtExpirestTime: jwtProfile.jwtExpiresTime
}

export const authService = new JwtAuthService(authSettings)
