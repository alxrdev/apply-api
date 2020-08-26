import { injectable, inject } from 'tsyringe'

import IJobRepository from '../repositories/IJobRepository'
import IStorageService from '../../../services/storage/interfaces/IStorageService'
import { ApplyToJobDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'
import ApplyError from '../errors/ApplyError'

@injectable()
export default class ApplyToJobUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository,

    @inject('DiskStorageService')
    private readonly storageService: IStorageService
  ) {}

  public async apply (applyDto: ApplyToJobDTO): Promise<void> {
    try {
      await validateClassParameters(applyDto)

      const job = await this.jobRepository.findById(applyDto.id)

      if (job.getLastDate() < new Date()) {
        throw new ApplyError('You can not apply to this job. Date is over.', false, 400)
      }

      await this.jobRepository.applyToJob(applyDto.id, applyDto.userId, applyDto.resume)

      await this.storageService.save(applyDto.resume)
    } catch (error) {
      if (applyDto.resume && applyDto.resume !== '') await this.storageService.delete(applyDto.resume, true)
      throw error
    }
  }
}
