import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { ListJobsAppliedUseCase } from '../useCases'
import { ListJobsAppliedDTO } from '../dtos'

import { plainToClass } from 'class-transformer'
import JobMapper from '../utils/JobMapper'

@injectable()
export default class UsersJobsAppliedController {
  constructor (
    private readonly listJobsAppliedUseCase: ListJobsAppliedUseCase
  ) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const listJobsDto = plainToClass(ListJobsAppliedDTO, { ...request.params, authId: request.user.id })

    try {
      const jobs = await this.listJobsAppliedUseCase.execute(listJobsDto)

      return response.status(200).json({
        success: true,
        message: 'Jobs applied.',
        data: JobMapper.fromJobArrayToJobResponseArray(jobs)
      })
    } catch (error) {
      next(error)
    }
  }
}
