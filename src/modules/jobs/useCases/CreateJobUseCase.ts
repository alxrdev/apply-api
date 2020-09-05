import { injectable, inject } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'

import IJobRepository from '../repositories/IJobRepository'
import IUserRepository from '../../users/repositories/IUserRepository'
import { Job, Address } from '../entities'
import { CreateJobDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'

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

    const job = new Job(
      uuidv4(),
      user,
      jobDto.title,
      jobDto.description,
      new Address(jobDto.state, jobDto.city),
      jobDto.jobType,
      jobDto.salary,
      new Date()
    )

    return await this.jobRepository.create(job)
  }
}
