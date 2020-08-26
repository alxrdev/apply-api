import IUserRepository from '../repositories/IUserRepository'
import AuthDTO from '../dtos/AuthDTO'
import User from '../entities/User'
import validateClassParameters from '../../../utils/validateClassParameters'
import AuthenticationError from '../errors/AuthenticationError'
import AppError from '../../../errors/AppError'
import bcrypt from 'bcrypt'
import jsonWebToken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export interface IAuthUserResponse {
  user: User
  token: string
}

export default class AuthenticateUserUseCase {
  private jwtSecret: string
  private jwtExpirestTime: string

  constructor (
    private readonly userRepository: IUserRepository
  ) {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_TIME) {
      throw new AppError('Jwt env variables not loaded.')
    }

    this.jwtSecret = process.env.JWT_SECRET
    this.jwtExpirestTime = process.env.JWT_EXPIRES_TIME
  }

  public async authenticateUser (userDto: AuthDTO): Promise<IAuthUserResponse> {
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

    const token = jsonWebToken.sign(
      {
        id: user.id,
        role: user.role
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpirestTime }
    )

    return {
      user,
      token
    }
  }
}
