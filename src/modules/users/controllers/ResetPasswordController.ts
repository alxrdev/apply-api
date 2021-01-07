import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { ResetPasswordUseCase } from '../useCases'
import { ResetPasswordDTO } from '../dtos'

import { plainToClass } from 'class-transformer'

@injectable()
export default class ResetPasswordController {
  constructor (
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const resetPasswordDto = plainToClass(ResetPasswordDTO, { ...request.body, ...request.params })

    try {
      await this.resetPasswordUseCase.execute(resetPasswordDto)

      return response.status(201).json({
        success: true,
        message: 'Password restored.'
      })
    } catch (error) {
      next(error)
    }
  }
}
