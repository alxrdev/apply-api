import { injectable, inject } from 'tsyringe'

import IJobRepository from '../repositories/IJobRepository'
import { Job, Address } from '../entities'
import { UpdateJobDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'
import { AppError } from '../../../errors'

@injectable()
export default class UpdateJobUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository
  ) {}

  public async execute (jobDto: UpdateJobDTO): Promise<Job> {
    await validateClassParameters(jobDto)

    const jobToUpdate = await this.jobRepository.findById(jobDto.id)

    if (jobToUpdate.user.id !== jobDto.authId) {
      throw new AppError('You don\'t have permission to edit this job.', false, 403)
    }

    const jobUpdated = new Job(
      jobToUpdate.id,
      jobToUpdate.user,
      jobDto.title,
      jobDto.description,
      new Address(jobDto.state, jobDto.city),
      jobDto.jobType,
      jobDto.salary,
      jobToUpdate.createdAt
    )

    return await this.jobRepository.update(jobUpdated)
  }
}
