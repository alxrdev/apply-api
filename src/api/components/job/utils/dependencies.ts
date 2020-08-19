import JobRepository from '../repositories/mongodb/JobRepository'
import CreateJob from '../useCases/CreateJob'
import UpdateJob from '../useCases/UpdateJob'
import DeleteJob from '../useCases/DeleteJob'
import ShowJob from '../useCases/ShowJob'
import ListJobs from '../useCases/ListJobs'
import FindJobsByGeolocation from '../useCases/FindJobsByGeolocation'

export const jobRepository = new JobRepository()

export const createJobUseCase = new CreateJob(jobRepository)

export const updateJobUseCase = new UpdateJob(jobRepository)

export const deleteJobUseCase = new DeleteJob(jobRepository)

export const showJobUseCase = new ShowJob(jobRepository)

export const listJobsUseCase = new ListJobs(jobRepository)

export const findJobsByGeolocation = new FindJobsByGeolocation(jobRepository)
