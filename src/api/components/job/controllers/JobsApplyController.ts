import ApplyToJobUseCase from '../useCases/ApplyToJobUseCase'
import { Request, Response, NextFunction } from 'express'
import ApplyToJobDTO from '../dtos/ApplyToJobDTO'
import { plainToClass } from 'class-transformer'

export default class JobsApplyController {
  constructor (
    private readonly applyToJobUseCase: ApplyToJobUseCase
  ) {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const applyDto = plainToClass(ApplyToJobDTO, { ...request.params, userId: request.user.id, resume: (request.file) ? request.file.filename : undefined })

    try {
      await this.applyToJobUseCase.apply(applyDto)

      return response.status(201).json({
        sucess: true,
        message: 'User applied to job.'
      })
    } catch (error) {
      return next(error)
    }
  }
}
