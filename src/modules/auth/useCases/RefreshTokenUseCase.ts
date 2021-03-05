import { injectable, inject } from 'tsyringe'

import IUserRepository from '../../users/repositories/IUserRepository'
import { IAuthResponse } from '../entities'
import { AuthenticationError } from '../errors'
import ITokenBasedAuthService from '@services/auth/interfaces/ITokenBasedAuthService'

@injectable()
export default class RefreshTokenUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('AuthService')
    private readonly authService: ITokenBasedAuthService
  ) {}

  public async execute (token: string): Promise<IAuthResponse> {
    let decodedToken

    try {
      decodedToken = this.authService.decodeToken(token)
    } catch (error) {
      throw new AuthenticationError('Invalid JWT token.', false, 401)
    }

    // config the limit time to refresh the token in 1 hour after expires time
    const limitTime = new Date(decodedToken.exp * 1000)
    limitTime.setHours(limitTime.getHours() + 1)

    if (limitTime.getTime() <= Date.now()) {
      throw new AuthenticationError('Invalid JWT token.', false, 401)
    }

    const user = await this.userRepository.findById(decodedToken.id)

    const newToken = this.authService.generateToken(user)

    return { user: user, token: newToken }
  }
}
