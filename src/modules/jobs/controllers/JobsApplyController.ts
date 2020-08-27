import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { ApplyToJobUseCase } from '../useCases'
import { ApplyToJobDTO } from '../dtos'

import { plainToClass } from 'class-transformer'

@injectable()
export default class JobsApplyController {
  constructor (
    private readonly applyToJobUseCase: ApplyToJobUseCase
  ) {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const applyDto = plainToClass(ApplyToJobDTO, { ...request.params, userId: request.user.id, resume: (request.file) ? request.file.filename : undefined })

    try {
      await this.applyToJobUseCase.execute(applyDto)

      return response.status(201).json({
        sucess: true,
        message: 'User applied to job.'
      })
    } catch (error) {
      return next(error)
    }
  }
}
