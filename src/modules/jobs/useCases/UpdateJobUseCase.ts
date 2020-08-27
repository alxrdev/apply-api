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

  public async update (jobDto: UpdateJobDTO): Promise<Job> {
    await validateClassParameters(jobDto)

    const jobToUpdate = await this.jobRepository.findById(jobDto.id)

    if (jobToUpdate.userId !== jobDto.authId) {
      throw new AppError('You don\'t have permission to edit this job.', false, 403)
    }

    const jobUpdated = new Job(
      jobToUpdate.id,
      jobToUpdate.userId,
      jobDto.title,
      jobDto.description,
      new Address(jobDto.country, jobDto.city),
      jobDto.jobType,
      jobDto.workTime,
      (jobDto.workplace === 'This country') ? `${jobDto.country} Only` : jobDto.workplace,
      false,
      jobDto.tags,
      jobDto.salary,
      jobToUpdate.lastDate,
      jobToUpdate.createdAt
    )

    return await this.jobRepository.update(jobUpdated)
  }
}
