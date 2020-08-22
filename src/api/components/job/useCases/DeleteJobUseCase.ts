import IJobRepository from '../repositories/IJobRepository'

export default class DeleteJobUseCase {
  constructor (
    private readonly jobRepository: IJobRepository
  ) {}

  public async delete (id: string): Promise<void> {
    await this.jobRepository.findById(id)
    await this.jobRepository.delete(id)
  }
}
