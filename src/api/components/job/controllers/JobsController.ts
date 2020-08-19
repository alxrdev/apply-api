import { Request, Response, NextFunction } from 'express'
import JobMapper from '../utils/JobMapper'
import CreateJob from '../useCases/CreateJob'
import ListJobs from '../useCases/ListJobs'
import UpdateJob from '../useCases/UpdateJob'
import DeleteJob from '../useCases/DeleteJob'
import ShowJob from '../useCases/ShowJob'

class JobsController {
  constructor (
    private readonly listJobsUseCase: ListJobs,
    private readonly showJobUseCase: ShowJob,
    private readonly createJobUseCase: CreateJob,
    private readonly updateJobUseCase: UpdateJob,
    private readonly deleteJobUseCase: DeleteJob
  ) {}

  public async index (request: Request, response: Response, next: NextFunction) {
    try {
      const jobs = await this.listJobsUseCase.listJobs()

      return response.status(200).json({
        success: true,
        message: 'All jobs',
        data: {
          jobs: JobMapper.fromJobArrayToJobResponseArray(jobs)
        }
      })
    } catch (error) {
      return next(error)
    }
  }

  public async show (request: Request, response: Response, next: NextFunction) {
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

  public async create (request: Request, response: Response, next: NextFunction) {
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

  public async update (request: Request, response: Response, next: NextFunction) {
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

  public async delete (request: Request, response: Response, next: NextFunction) {
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
