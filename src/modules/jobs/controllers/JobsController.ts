import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { CreateJobUseCase, ListJobsUseCase, UpdateJobUseCase, DeleteJobUseCase, ShowJobUseCase } from '../useCases'
import { ListJobsFiltersDTO, CreateJobDTO, UpdateJobDTO, DeleteJobDTO } from '../dtos'

import JobMapper from '../utils/JobMapper'
import { plainToClass } from 'class-transformer'

@injectable()
class JobsController {
  constructor (
    private readonly listJobsUseCase: ListJobsUseCase,
    private readonly showJobUseCase: ShowJobUseCase,
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly updateJobUseCase: UpdateJobUseCase,
    private readonly deleteJobUseCase: DeleteJobUseCase
  ) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const filtersDto = plainToClass(ListJobsFiltersDTO, request.query)

    try {
      const result = await this.listJobsUseCase.execute(filtersDto)

      return response.status(200).json({
        success: true,
        message: 'All jobs',
        totalItems: result.count,
        previousPage: result.previous,
        nextPage: result.next,
        data: JobMapper.fromJobArrayToJobResponseArray(result.collection)
      })
    } catch (error) {
      return next(error)
    }
  }

  public show = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params as { id: string }

    try {
      const job = await this.showJobUseCase.execute(id)

      return response.status(200).json({
        success: true,
        message: 'Showing job',
        data: JobMapper.fromJobToJobResponse(job)
      })
    } catch (error) {
      return next(error)
    }
  }

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const jobDto = plainToClass(CreateJobDTO, { ...request.body, userId: request.user.id })

    try {
      const job = await this.createJobUseCase.execute(jobDto)

      return response.status(201).json({
        success: true,
        message: 'Job created',
        data: JobMapper.fromJobToJobResponse(job)
      })
    } catch (error) {
      return next(error)
    }
  }

  public update = async (request: Request, response: Response, next: NextFunction) => {
    const jobDto = plainToClass(UpdateJobDTO, { ...request.params, ...request.body, authId: request.user.id })

    try {
      const job = await this.updateJobUseCase.execute(jobDto)

      return response.status(201).json({
        success: true,
        message: 'Job updated',
        data: JobMapper.fromJobToJobResponse(job)
      })
    } catch (error) {
      return next(error)
    }
  }

  public delete = async (request: Request, response: Response, next: NextFunction) => {
    const deleteJobDto = plainToClass(DeleteJobDTO, { ...request.params, authId: request.user.id })

    try {
      await this.deleteJobUseCase.execute(deleteJobDto)

      return response.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export default JobsController
