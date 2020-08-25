import DiskStorageService from '../../../../services/storage/DiskStorageService'
import { diskStorage } from '../../../../configs/storage'

import JobRepository from '../repositories/mongodb/JobRepository'
import CreateJobUseCase from '../useCases/CreateJobUseCase'
import UpdateJobUseCase from '../useCases/UpdateJobUseCase'
import DeleteJobUseCase from '../useCases/DeleteJobUseCase'
import ShowJobUseCase from '../useCases/ShowJobUseCase'
import ListJobsUseCase from '../useCases/ListJobsUseCase'
import FindJobsByGeolocationUseCase from '../useCases/FindJobsByGeolocationUseCase'

export const jobRepository = new JobRepository()

export const createJobUseCase = new CreateJobUseCase(jobRepository)

export const updateJobUseCase = new UpdateJobUseCase(jobRepository)

export const deleteJobUseCase = new DeleteJobUseCase(jobRepository)

export const showJobUseCase = new ShowJobUseCase(jobRepository)

export const listJobsUseCase = new ListJobsUseCase(jobRepository)

export const findJobsByGeolocation = new FindJobsByGeolocationUseCase(jobRepository)

export const diskStorageService = new DiskStorageService(diskStorage)
