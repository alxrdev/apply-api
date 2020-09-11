import { inject, injectable } from 'tsyringe'

import IJobRepository from '../repositories/IJobRepository'
import { UserApplied } from '../entities'
import { ShowUserAppliedDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'
import { AppError } from '../../../errors'

@injectable()
export default class ShowUserAppliedUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository
  ) {}

  public async execute (showUserDto: ShowUserAppliedDTO): Promise<UserApplied> {
    await validateClassParameters(showUserDto)

    const job = await this.jobRepository.findById(showUserDto.id)

    if (job.user.id !== showUserDto.authUserId) {
      throw new AppError('You don\'t have permission to see users applied to this job.', false, 403)
    }

    return await this.jobRepository.findUserAppliedToJob(showUserDto.id, showUserDto.userId)
  }
}
