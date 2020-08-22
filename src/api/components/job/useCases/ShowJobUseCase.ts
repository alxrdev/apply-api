import IJobRepository from '../repositories/IJobRepository'
import Job from '../entities/Job'

export default class ShowJobUseCase {
  constructor (
    private readonly jobRepository: IJobRepository
  ) {}

  public async show (id: string): Promise<Job> {
    const job = await this.jobRepository.findById(id)
    return job
  }
}
