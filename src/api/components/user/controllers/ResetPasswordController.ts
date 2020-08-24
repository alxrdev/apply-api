import { Request, Response, NextFunction } from 'express'
import ResetPasswordUseCase from '../useCases/ResetPasswordUseCase'
import ResetPasswordDTO from '../dtos/ResetPasswordDTO'
import { plainToClass } from 'class-transformer'

export default class ResetPasswordController {
  constructor (
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const resetPasswordDto = plainToClass(ResetPasswordDTO, { ...request.body, ...request.params })

    try {
      await this.resetPasswordUseCase.resetPassword(resetPasswordDto)

      return response.status(201).json({
        success: true,
        message: 'Password reseted.'
      })
    } catch (error) {
      next(error)
    }
  }
}
