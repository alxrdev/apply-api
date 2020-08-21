import IJobRepository from '../repositories/IJobRepository'
import UpdateJobDTO from '../dtos/UpdateJobDTO'
import Job from '../entities/Job'
import slugify from 'slugify'
import validateClassParameters from '../../../../utils/validateClassParameters'

export default class UpdateJob {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async update (jobDto: UpdateJobDTO): Promise<Job> {
    const jobToUpdate = await this.jobRepository.fetchById(jobDto.id)

    const jobUpdated = new Job(
      jobToUpdate.getId(),
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
      jobToUpdate.getPostingDate(),
      jobToUpdate.getLastDate()
    )

    await validateClassParameters(jobUpdated)

    return await this.jobRepository.update(jobUpdated)
  }
}
