import { injectable, inject } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'

import IJobRepository from '../repositories/IJobRepository'
import { Job, Address } from '../entities'
import { CreateJobDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'

@injectable()
export default class CreateJobUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository
  ) {}

  public async execute (jobDto: CreateJobDTO): Promise<Job> {
    await validateClassParameters(jobDto)

    const lastDate = new Date()
    lastDate.setDate(lastDate.getDate() + 7)

    const job = new Job(
      uuidv4(),
      jobDto.userId,
      jobDto.title,
      jobDto.description,
      new Address(jobDto.country, jobDto.city),
      jobDto.jobType,
      jobDto.workTime,
      (jobDto.workplace === 'This country') ? `${jobDto.country} Only` : jobDto.workplace,
      false,
      jobDto.tags,
      jobDto.salary,
      lastDate,
      new Date()
    )

    return await this.jobRepository.create(job)
  }
}
