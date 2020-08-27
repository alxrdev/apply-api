import { injectable, inject } from 'tsyringe'

import IJobRepository from '../repositories/IJobRepository'
import { Job } from '../entities'

@injectable()
export default class ShowJobUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository
  ) {}

  public async execute (id: string): Promise<Job> {
    const job = await this.jobRepository.findById(id)
    return job
  }
}
