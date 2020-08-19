import { Request, Response } from 'express'
import JobMapper from '../utils/JobMapper'
import JobRepository from '../repositories/mongodb/JobRepository'
import CreateJob from '../useCases/CreateJob'
import ListJobs from '../useCases/ListJobs'
import UpdateJob from '../useCases/UpdateJob'
import DeleteJob from '../useCases/DeleteJob'

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

  public async update (request: Request, response: Response) {
    const { id } = request.params
    const { title, description, email, address, company, industry, jobType, minEducation, experience, salary, position } = request.body

    try {
      const jobDto = JobMapper.fromBodyToUpdateJobDTO(id, title, description, email, address, company, industry, jobType, minEducation, experience, salary, position)

      const updateJobUseCase = new UpdateJob(new JobRepository())

      const job = await updateJobUseCase.update(jobDto)

      return response.status(201).json({
        success: true,
        message: 'Job updated',
        data: {
          job: JobMapper.fromJobToJobResponse(job)
        }
      })
    } catch (err) {
      return response.status(400).json({
        success: false,
        message: 'Error on update job',
        error_code: 400,
        error_message: err.message
      })
    }
  }

  public async delete (request: Request, response: Response) {
    const { id } = request.params

    try {
      const deleteJobUseCase = new DeleteJob(new JobRepository())

      await deleteJobUseCase.delete(id)

      return response.status(204).json({
        success: true,
        message: 'Job deleted',
        data: {}
      })
    } catch (err) {
      return response.status(400).json({
        success: false,
        message: 'Error on delete job',
        error_code: 400,
        error_message: err.message
      })
    }
  }
}

export default JobsController
