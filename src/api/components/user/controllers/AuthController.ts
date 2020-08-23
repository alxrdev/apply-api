import { Request, Response, NextFunction } from 'express'
import AuthenticateUserUseCase from '../useCases/AuthenticateUserUseCase'
import { plainToClass } from 'class-transformer'
import AuthDTO from '../dtos/AuthDTO'

export default class AuthController {
  constructor (
    private readonly authenticateUserUseCase: AuthenticateUserUseCase
  ) {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const userDto = plainToClass(AuthDTO, request.body)

    try {
      const result = await this.authenticateUserUseCase.authenticateUser(userDto)

      return response.status(200).json({
        success: true,
        message: 'User authenticated.',
        data: result.token
      })
    } catch (error) {
      next(error)
    }
  }
}
