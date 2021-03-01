import { injectable } from 'tsyringe'
import jsonWebToken from 'jsonwebtoken'

import IAuthService from './interfaces/IAuthService'
import { User } from '../../modules/users/entities'
import IAuthSettings from './interfaces/IAuthSettings'
import { AppError } from '../../errors'
import ITokenBasedAuthService, { Payload } from './interfaces/ITokenBasedAuthService'

@injectable()
export default class JwtAuthService implements IAuthService, ITokenBasedAuthService {
  constructor (
    private readonly authSettings: IAuthSettings
  ) {
    if (!authSettings.jwtSecret || !authSettings.jwtExpirestTime) {
      throw new AppError('Jwt env variables not loaded.')
    }
  }

  public authenticateUser (user: User): string {
    return this.generateToken(user)
  }

  public generateToken (user: User) : string {
    const token = jsonWebToken.sign(
      { id: user.id, role: user.role },
      this.authSettings.jwtSecret,
      { expiresIn: this.authSettings.jwtExpirestTime }
    )

    return token
  }

  public decodeToken (token: string) : Payload {
    const decode = jsonWebToken.verify(token ?? '', this.authSettings.jwtSecret, { ignoreExpiration: true })
    return decode as Payload
  }
}
