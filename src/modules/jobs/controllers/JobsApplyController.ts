import { Request, Response, NextFunction } from 'express'
import ListJobsAppliedUseCase from '../useCases/ListJobsAppliedUseCase'
import ApplyToJobUseCase from '../useCases/ApplyToJobUseCase'
import ApplyToJobDTO from '../dtos/ApplyToJobDTO'
import ListJobsAppliedDTO from '../dtos/ListJobsAppliedDTO'
import { plainToClass } from 'class-transformer'
import JobMapper from '../utils/JobMapper'

export default class JobsApplyController {
  constructor (
    private readonly listJobsAppliedUseCase: ListJobsAppliedUseCase,
    private readonly applyToJobUseCase: ApplyToJobUseCase
  ) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const listJobsDto = plainToClass(ListJobsAppliedDTO, { userId: request.params.id, authId: request.user.id })

    try {
      const jobs = await this.listJobsAppliedUseCase.list(listJobsDto)

      return response.status(200).json({
        sucess: true,
        message: 'Jobs applied.',
        data: JobMapper.fromJobArrayToJobResponseArray(jobs)
      })
    } catch (error) {
      next(error)
    }
  }

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
