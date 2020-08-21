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
    options.jobType = options.jobType ?? ''
    options.minEducation = options.minEducation ?? ''

    options.industry = options.industry ?? ['']
    options.industryRegex = options.industry.map((industry: string) => RegExp(`^${industry}`))

    options.page = options.page ?? 1

    options.limit = Number(options.limit) ?? 10
    options.limit = (options.limit < 1) ? 1 : options.limit
    options.limit = (options.limit > 20) ? 20 : options.limit

    return await this.jobRepository.fetchAll(options)
  }
}
