import { injectable, inject } from 'tsyringe'
import bcrypt from 'bcrypt'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import IAuthProvider from '@src/providers/auth/interfaces/IAuthProvider'
import { AuthDTO } from '@modules/auth/dtos'
import { IAuthResponse } from '@modules/auth/entities'
import { AuthenticationError } from '@modules/auth/errors'
import { User } from '@modules/users/entities'
import validateClassParameters from '@utils/validateClassParameters'

@injectable()
export default class AuthenticateUserUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('AuthProvider')
    private readonly authProvider: IAuthProvider
  ) {}

  public async execute (userDto: AuthDTO): Promise<IAuthResponse> {
    await validateClassParameters(userDto)

    let user: User

    try {
      user = await this.userRepository.findByEmail(userDto.email)
    } catch (error) {
      throw new AuthenticationError('Incorrect email/password combination.', false, 401)
    }

    const passwordMatched = bcrypt.compareSync(userDto.password, user.password)

    if (!passwordMatched) {
      throw new AuthenticationError('Incorrect email/password combination.', false, 401)
    }

    const token = this.authProvider.authenticateUser(user)

    return {
      user,
      token
    }
  }
}
