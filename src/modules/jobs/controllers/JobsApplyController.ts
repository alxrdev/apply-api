import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { ApplyToJobUseCase, ListUsersAppliedUseCase } from '../useCases'
import { ApplyToJobDTO, ListUsersAppliedDTO } from '../dtos'

import { plainToClass } from 'class-transformer'
import JobMapper from '../utils/JobMapper'

@injectable()
export default class JobsApplyController {
  constructor (
    private readonly applyToJobUseCase: ApplyToJobUseCase,
    private readonly listUsersAppliedUseCase: ListUsersAppliedUseCase
  ) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const usersAppliedDto = plainToClass(ListUsersAppliedDTO, { ...request.params, authUserId: request.user.id })

    try {
      const result = await this.listUsersAppliedUseCase.execute(usersAppliedDto)

      return response.status(201).json({
        sucess: true,
        message: 'Users applied to this job.',
        data: JobMapper.fromUserAppliedArrayToUserAppliedResponseArray(result)
      })
    } catch (error) {
      return next(error)
    }
  }

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
