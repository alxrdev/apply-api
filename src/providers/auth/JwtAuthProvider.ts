import { injectable } from 'tsyringe'
import jsonWebToken from 'jsonwebtoken'

import IAuthProvider from './interfaces/IAuthProvider'
import { User } from '@modules/users/entities'
import IAuthSettings from './interfaces/IAuthSettings'
import { jwtProfile } from '@configs/auth'
import ITokenBasedAuthProvider, { Payload } from './interfaces/ITokenBasedAuthProvider'

@injectable()
export default class JwtAuthProvider implements IAuthProvider, ITokenBasedAuthProvider {
  private readonly authSettings: IAuthSettings

  constructor (authSettings?: IAuthSettings) {
    this.authSettings = authSettings || {
      jwtSecret: jwtProfile.jwtSecret,
      jwtExpiresTime: jwtProfile.jwtExpiresTime
    }
  }

  public authenticateUser (user: User): string {
    return this.generateToken(user)
  }

  public generateToken (user: User) : string {
    const token = jsonWebToken.sign(
      { id: user.id, role: user.role },
      this.authSettings.jwtSecret,
      { expiresIn: this.authSettings.jwtExpiresTime }
    )

    return token
  }

  public decodeToken (token: string) : Payload {
    const decode = jsonWebToken.verify(token ?? '', this.authSettings.jwtSecret, { ignoreExpiration: true })
    return decode as Payload
  }
}
