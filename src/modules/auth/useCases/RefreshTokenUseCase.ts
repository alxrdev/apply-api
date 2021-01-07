import { injectable, inject } from 'tsyringe'
import jsonWebToken from 'jsonwebtoken'

import { authSettings } from '../../../services/auth'

import IAuthService from '../../../services/auth/interfaces/IAuthService'
import IUserRepository from '../../users/repositories/IUserRepository'
import { IAuthResponse } from '../entities'
import { AppError } from '../../../errors'
import { AuthenticationError } from '../errors'

@injectable()
export default class RefreshTokenUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('AuthService')
    private readonly authService: IAuthService
  ) {}

  public async execute (token: string): Promise<IAuthResponse> {
    if (!authSettings.jwtSecret) {
      throw new AppError('Jwt env variables not loaded.')
    }

    let decoded

    try {
      decoded = jsonWebToken.verify(token ?? '', authSettings.jwtSecret, { ignoreExpiration: true })
    } catch (error) {
      throw new AuthenticationError('Invalid JWT token.', false, 401)
    }

    const { id, exp } = decoded as { id: string; role: string, exp: number }

    // config the limit time to refresh the token
    const limiteTime = new Date()
    limiteTime.setTime((exp * 1000))
    limiteTime.setHours(limiteTime.getHours() + 1)

    const timeNow = new Date()

    if (limiteTime.getTime() <= timeNow.getTime()) {
      throw new AuthenticationError('Invalid JWT token.', false, 401)
    }

    const user = await this.userRepository.findById(id)

    const newToken = this.authService.authenticateUser(user)

    return { user: user, token: newToken }
  }
}
