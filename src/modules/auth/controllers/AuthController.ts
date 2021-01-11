import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { AuthenticateUserUseCase } from '../useCases'
import { AuthDTO } from '../dtos'

import { plainToClass } from 'class-transformer'
import UserMapper from '../../users/utils/UserMapper'

@injectable()
export default class AuthController {
  constructor (
    private readonly authenticateUserUseCase: AuthenticateUserUseCase
  ) {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const userDto = plainToClass(AuthDTO, request.body)

    try {
      const result = await this.authenticateUserUseCase.execute(userDto)

      // config the cookie expires date
      const cookieExpiresDate = () => {
        const date = new Date()
        date.setDate(date.getDate() + 15)
        return date
      }

      return response.status(200)
        .cookie('@Apply:token', result.token, { httpOnly: true, path: '/', expires: cookieExpiresDate(), sameSite: 'none', secure: true })
        .json({
          success: true,
          message: 'User authenticated.',
          data: {
            token: result.token,
            user: UserMapper.fromUserToUserResponse(result.user)
          }
        })
    } catch (error) {
      next(error)
    }
  }
}
