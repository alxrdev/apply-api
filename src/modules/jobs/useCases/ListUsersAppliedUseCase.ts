import { inject, injectable } from 'tsyringe'

import IJobRepository from '../repositories/IJobRepository'
import { ListUsersAppliedDTO } from '../dtos'
import { AppError } from '../../../errors'
import validateClassParameters from '../../../utils/validateClassParameters'
import { UserApplied } from '../entities'

@injectable()
export default class ListUsersAppliedUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository
  ) {}

  public async execute (jobDto: ListUsersAppliedDTO): Promise<Array<UserApplied>> {
    await validateClassParameters(jobDto)

    const job = await this.jobRepository.findById(jobDto.id)

    if (job.user.id !== jobDto.authUserId) {
      throw new AppError('You don\'t have permission to see users applied to this job.', false, 403)
    }

    return await this.jobRepository.findAllUsersAppliedToJob(jobDto.id)
  }
}
