import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'
import { plainToClass } from 'class-transformer'

import { AuthenticateUserUseCase } from '../useCases'
import { ShowUserUseCase } from '@src/modules/users/useCases'
import { AuthDTO } from '../dtos'
import UserMapper from '../../users/utils/UserMapper'
import { nodeEnvironment } from '@src/configs/base'

@injectable()
export default class AuthController {
  constructor (
    private readonly showUserUseCase: ShowUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase
  ) {}

  public show = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = await this.showUserUseCase.execute(request.user.id)

      return response.status(200).json({
        success: true,
        message: 'Authenticated user',
        data: UserMapper.fromUserToUserResponse(user, false)
      })
    } catch (error) {
      next(error)
    }
  }

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
        .cookie('@Apply:token', result.token, { httpOnly: true, path: '/', expires: cookieExpiresDate(), sameSite: 'none', secure: (nodeEnvironment === 'production') })
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
