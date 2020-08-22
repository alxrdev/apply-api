import { Request, Response, NextFunction } from 'express'
import JobMapper from '../utils/JobMapper'
import CreateJobUseCase from '../useCases/CreateJobUseCase'
import ListJobsUseCase from '../useCases/ListJobsUseCase'
import UpdateJobUseCase from '../useCases/UpdateJobUseCase'
import DeleteJobUseCase from '../useCases/DeleteJobUseCase'
import ShowJobUseCase from '../useCases/ShowJobUseCase'
import ListJobsFiltersDTO from '../dtos/ListJobsFiltersDTO'

class JobsController {
  constructor (
    private readonly listJobsUseCase: ListJobsUseCase,
    private readonly showJobUseCase: ShowJobUseCase,
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly updateJobUseCase: UpdateJobUseCase,
    private readonly deleteJobUseCase: DeleteJobUseCase
  ) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const { title, description, company, industry, jobType, minEducation, page, limit } = request.query

    try {
      const result = await this.listJobsUseCase.listJobs({ title, description, company, industry, jobType, minEducation, page, limit } as ListJobsFiltersDTO)

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
    const { id } = request.params

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
    const { title, description, email, address, company, industry, jobType, minEducation, experience, salary, position } = request.body

    try {
      const jobDto = JobMapper.fromBodyToCreateJobDTO(title, description, email, address, company, industry, jobType, minEducation, experience, salary, position)

      const job = await this.createJobUseCase.create(jobDto)

      return response.status(201).json({
        success: true,
        message: 'Job created',
        data: {
          job: JobMapper.fromJobToJobResponse(job)
        }
      })
    } catch (error) {
      return next(error)
    }
  }

  public update = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params
    const { title, description, email, address, company, industry, jobType, minEducation, experience, salary, position } = request.body

    try {
      const jobDto = JobMapper.fromBodyToUpdateJobDTO(id, title, description, email, address, company, industry, jobType, minEducation, experience, salary, position)

      const job = await this.updateJobUseCase.update(jobDto)

      return response.status(201).json({
        success: true,
        message: 'Job updated',
        data: {
          job: JobMapper.fromJobToJobResponse(job)
        }
      })
    } catch (error) {
      return next(error)
    }
  }

  public delete = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params

    try {
      await this.deleteJobUseCase.delete(id)

      return response.status(204).json({
        success: true,
        message: 'Job deleted',
        data: {}
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default JobsController
