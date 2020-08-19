import IJobRepository from '../repositories/IJobRepository'
import Job from '../entities/Job'

export default class ShowJob {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async show (id: string): Promise<Job> {
    const job = await this.jobRepository.fetchById(id)
    return job
  }
}
