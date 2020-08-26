import IJobRepository from '../repositories/IJobRepository'
import ListPublishedJobsByUserDTO from '../dtos/ListPublishedJobsByUserDTO'
import Job from '../entities/Job'
import validateClassParameters from '../../../utils/validateClassParameters'

export default class ListPublishedJobsByUserUseCase {
  constructor (
    private readonly jobRepository: IJobRepository
  ) {}

  public async list (userDto: ListPublishedJobsByUserDTO): Promise<Array<Job>> {
    await validateClassParameters(userDto)
    return await this.jobRepository.findAllByUserId(userDto.id)
  }
}
