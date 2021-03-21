import { injectable, inject } from 'tsyringe'

import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import { Job, Address } from '@modules/jobs/entities'
import { CreateJobDTO } from '@modules/jobs/dtos'
import validateClassParameters from '@utils/validateClassParameters'

@injectable()
export default class CreateJobUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository,

    @inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  public async execute (jobDto: CreateJobDTO): Promise<Job> {
    await validateClassParameters(jobDto)

    const user = await this.userRepository.findById(jobDto.userId)

    const job = Job.builder()
      .withUser(user)
      .withTitle(jobDto.title)
      .withDescription(jobDto.description)
      .withAddress(new Address(jobDto.state, jobDto.city))
      .withJobType(jobDto.jobType)
      .withSalary(jobDto.salary)
      .build()

    return await this.jobRepository.create(job)
  }
}
