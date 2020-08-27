import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { ForgotPasswordUseCase } from '../useCases'
import { ForgotPasswordDTO } from '../dtos'

import { plainToClass } from 'class-transformer'

@injectable()
export default class ForgotPasswordController {
  constructor (
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase
  ) {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const forgotPasswordDto = plainToClass(ForgotPasswordDTO, request.body)

    try {
      await this.forgotPasswordUseCase.execute(forgotPasswordDto)

      return response.status(201).json({
        success: true,
        message: 'We have sent you an e-mail containing your password reset link.'
      })
    } catch (error) {
      next(error)
    }
  }
}
