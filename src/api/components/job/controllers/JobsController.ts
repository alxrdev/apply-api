import { Request, Response, NextFunction } from 'express'
import CreateJobUseCase from '../useCases/CreateJobUseCase'
import ListJobsUseCase from '../useCases/ListJobsUseCase'
import UpdateJobUseCase from '../useCases/UpdateJobUseCase'
import DeleteJobUseCase from '../useCases/DeleteJobUseCase'
import ShowJobUseCase from '../useCases/ShowJobUseCase'
import CreateJobDTO from '../dtos/CreateJobDTO'
import ListJobsFiltersDTO from '../dtos/ListJobsFiltersDTO'
import JobMapper from '../utils/JobMapper'
import { plainToClass } from 'class-transformer'
import UpdateJobDTO from '../dtos/UpdateJobDTO'

class JobsController {
  constructor (
    private readonly listJobsUseCase: ListJobsUseCase,
    private readonly showJobUseCase: ShowJobUseCase,
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly updateJobUseCase: UpdateJobUseCase,
    private readonly deleteJobUseCase: DeleteJobUseCase
  ) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const { title, description, company, industry, jobType, minEducation, page, limit, sortBy, sortOrder } = request.query

    try {
      const result = await this.listJobsUseCase.listJobs({ title, description, company, industry, jobType, minEducation, page, limit, sortBy, sortOrder } as ListJobsFiltersDTO)

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
      const job = await this.showJobUseCase.show(id)

      return response.status(200).json({
        success: true,
        message: 'Showing job',
        data: {
          jobs: JobMapper.fromJobToJobResponse(job)
        }
      })
    } catch (error) {
      return next(error)
    }
  }

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const jobDto = plainToClass(CreateJobDTO, request.body)

    try {
      const job = await this.createJobUseCase.create(jobDto)

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
    const jobDto = plainToClass(UpdateJobDTO, { ...request.params, ...request.body })

    try {
      const job = await this.updateJobUseCase.update(jobDto)

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
    const { id } = request.params as { id: string }

    try {
      await this.deleteJobUseCase.delete(id)

      return response.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export default JobsController
