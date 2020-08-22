import IJobRepository from '../repositories/IJobRepository'
import Job from '../entities/Job'
import Industry from '../entities/Industry'
import JobType from '../entities/JobTypes'
import Education from '../entities/Education'
import Experience from '../entities/Experience'
import CreateJobDTO from '../dtos/CreateJobDTO'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import validateClassParameters from '../../../../utils/validateClassParameters'

export default class CreateJobUseCase {
  constructor (
    private readonly jobRepository: IJobRepository
  ) {}

  public async create (jobDto: CreateJobDTO): Promise<Job> {
    await validateClassParameters(jobDto)

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
      new Industry(jobDto.industry.split(',')),
      new JobType(jobDto.jobType),
      new Education(jobDto.minEducation),
      new Experience(jobDto.experience),
      jobDto.salary,
      jobDto.position,
      new Date(),
      lastDate
    )

    return await this.jobRepository.create(job)
  }
}
