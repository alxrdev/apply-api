import { Request, Response } from 'express'
import JobMapper from '../utils/JobMapper'
import JobRepository from '../repositories/mongodb/JobRepository'
import CreateJob from '../useCases/CreateJob'
import ListJobs from '../useCases/ListJobs'

class JobsController {
  public async index (request: Request, response: Response) {
    try {
      const listJobsUseCase = new ListJobs(new JobRepository())

      const jobs = await listJobsUseCase.listJobs()

      return response.status(200).json({
        success: true,
        message: 'All jobs',
        data: {
          jobs: JobMapper.fromJobArrayToJobResponseArray(jobs)
        }
      })
    } catch (err) {
      return response.status(500).json({
        success: false,
        message: 'Error on listing job',
        error_code: 500,
        error_message: err.message
      })
    }
  }

  public async create (request: Request, response: Response) {
    const { title, description, email, address, company, industry, jobType, minEducation, experience, salary, position } = request.body

    try {
      const jobDto = JobMapper.fromBodyToCreateJobDTO(title, description, email, address, company, industry, jobType, minEducation, experience, salary, position)

      const createJobUseCase = new CreateJob(new JobRepository())

      const job = await createJobUseCase.create(jobDto)

      return response.status(201).json({
        success: true,
        message: 'Job created',
        data: {
          job: JobMapper.fromJobToJobResponse(job)
        }
      })
    } catch (err) {
      return response.status(400).json({
        success: false,
        message: 'Error on create job',
        error_code: 400,
        error_message: err.message
      })
    }
  }
}

export default JobsController
