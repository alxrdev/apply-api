import { injectable, inject } from 'tsyringe'

import IJobRepository from '../repositories/IJobRepository'
import IStorageService from '../../../services/storage/interfaces/IStorageService'
import { ApplyToJobDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'

@injectable()
export default class ApplyToJobUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository,

    @inject('ResumeStorageService')
    private readonly storageService: IStorageService
  ) {}

  public async execute (applyDto: ApplyToJobDTO): Promise<void> {
    try {
      await validateClassParameters(applyDto)

      await this.jobRepository.findById(applyDto.id)

      await this.jobRepository.applyToJob(applyDto.id, applyDto.userId, applyDto.resume)

      await this.storageService.save(applyDto.resume)
    } catch (error) {
      if (applyDto.resume && applyDto.resume !== '') await this.storageService.delete(applyDto.resume, true)
      throw error
    }
  }
}
