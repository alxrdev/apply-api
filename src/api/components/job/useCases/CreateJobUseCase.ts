import IJobRepository from '../repositories/IJobRepository'
import CreateJobDTO from '../dtos/CreateJobDTO'
import Job from '../entities/Job'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import validateClassParameters from '../../../../utils/validateClassParameters'

export default class CreateJobUseCase {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async create (jobDto: CreateJobDTO): Promise<Job> {
    const lastDate = new Date()
    lastDate.setDate(lastDate.getDate() + 7)

    const job = new Job(
      uuidv4(),
      jobDto.title,
      slugify(jobDto.title ?? '', { lower: true }),
      jobDto.description,
      jobDto.email,
      jobDto.address,
      jobDto.company,
      jobDto.industry,
      jobDto.jobType,
      jobDto.minEducation,
      jobDto.experience,
      jobDto.salary,
      jobDto.position,
      new Date(),
      lastDate
    )

    await validateClassParameters(job)

    return await this.jobRepository.create(job)
  }
}
