import { injectable, inject } from 'tsyringe'

import IJobRepository from '../repositories/IJobRepository'
import { ListJobsAppliedDTO } from '../dtos'
import { Job } from '../entities'

import validateClassParameters from '../../../utils/validateClassParameters'
import AppError from '../../../errors/AppError'

@injectable()
export default class ListJobsAppliedUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository
  ) {}

  public async execute (listJobsDto: ListJobsAppliedDTO): Promise<Array<Job>> {
    await validateClassParameters(listJobsDto)

    if (listJobsDto.authId !== listJobsDto.userId) {
      throw new AppError('You don\'t have permission to access this resource.', false, 403)
    }

    return await this.jobRepository.findAppliedJobs(listJobsDto.userId)
  }
}
