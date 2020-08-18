import IJobRepository from '../repositories/IJobRepository'
import UpdateJobDTO from '../dtos/UpdateJobDTO'
import Job from '../entities/Job'
import slugify from 'slugify'

export default class UpdateJob {
  private jobsRepository: IJobRepository

  constructor (jobsRepository: IJobRepository) {
    this.jobsRepository = jobsRepository
  }

  public async update (jobDto: UpdateJobDTO): Promise<Job> {
    const jobToUpdate = await this.jobsRepository.fetchById(jobDto.id)

    const jobUpdated = new Job(
      jobToUpdate.getId(),
      jobDto.title,
      slugify(jobDto.title, { lower: true }),
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

    const result = await this.jobsRepository.update(jobUpdated)

    return result
  }
}
