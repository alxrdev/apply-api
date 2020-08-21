import IJobRepository from '../repositories/IJobRepository'
import Job from '../entities/Job'
import ListJobsDTO from '../dtos/ListJobsDTO'

export default class ListJobsUseCase {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async listJobs (options: ListJobsDTO): Promise<Array<Job>> {
    options.title = options.title ?? ''
    options.description = options.description ?? ''
    options.company = options.company ?? ''
    options.industry = options.industry ?? ['']
    options.jobType = options.jobType ?? ''
    options.minEducation = options.minEducation ?? ''

    options.industryRegex = options.industry.map((industry: string) => RegExp(`^${industry}`))

    console.log(options)

    return await this.jobRepository.fetchAll(options)
  }
}
