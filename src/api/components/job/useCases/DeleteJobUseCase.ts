import IJobRepository from '../repositories/IJobRepository'

export default class DeleteJobUseCase {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async delete (id: string): Promise<void> {
    await this.jobRepository.delete(id)
  }
}
