import { injectable, inject } from 'tsyringe'

import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { Job, Address } from '@modules/jobs/entities'
import { UpdateJobDTO } from '@modules/jobs/dtos'
import validateClassParameters from '@utils/validateClassParameters'
import { AppError } from '@errors/index'

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

    jobToUpdate.title = jobDto.title
    jobToUpdate.description = jobDto.description
    jobToUpdate.address = new Address(jobDto.state, jobDto.city)
    jobToUpdate.jobType = jobDto.jobType
    jobToUpdate.salary = jobDto.salary

    return await this.jobRepository.update(jobToUpdate)
  }
}
