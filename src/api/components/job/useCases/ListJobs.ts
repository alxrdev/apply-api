import IJobRepository from '../repositories/IJobRepository'
import Job from '../entities/Job'

export default class ListJobs {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async listJobs (): Promise<Array<Job>> {
    const jobs = await this.jobRepository.fetchAll()
    return jobs
  }
}
