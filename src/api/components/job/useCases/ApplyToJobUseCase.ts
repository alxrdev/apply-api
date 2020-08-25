import IJobRepository from '../repositories/IJobRepository'
import ApplyToJobDTO from '../dtos/ApplyToJobDTO'
import validateClassParameters from '../../../../utils/validateClassParameters'
import ApplyError from '../errors/ApplyError'

export default class ApplyToJobUseCase {
  constructor (
    private readonly jobRepository: IJobRepository
  ) {}

  public async apply (applyDto: ApplyToJobDTO): Promise<void> {
    await validateClassParameters(applyDto)

    const job = await this.jobRepository.findById(applyDto.id)

    if (job.getLastDate() < new Date()) {
      throw new ApplyError('You can not apply to this job. Date is over.', false, 400)
    }

    await this.jobRepository.applyToJob(applyDto.id, applyDto.userId, applyDto.resume)
  }
}
