import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { AuthenticateUserUseCase } from '../useCases'
import { AuthDTO } from '../dtos'

import { plainToClass } from 'class-transformer'

@injectable()
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
        data: {
          token: result.token
        }
      })
    } catch (error) {
      next(error)
    }
  }
}
