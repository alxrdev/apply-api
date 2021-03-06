import { injectable, inject } from 'tsyringe'

import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import IStorageService from '@providers/storage/interfaces/IStorageService'
import { DeleteJobDTO } from '@modules/jobs/dtos'
import AppError from '@errors/AppError'
import validateClassParameters from '@utils/validateClassParameters'

@injectable()
export default class DeleteJobUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository,

    @inject('ResumeStorageService')
    private readonly storageService: IStorageService
  ) {}

  public async execute (deleteJobDto: DeleteJobDTO): Promise<void> {
    await validateClassParameters(deleteJobDto)

    const job = await this.jobRepository.findById(deleteJobDto.id)

    if (job.user.id !== deleteJobDto.authId) {
      throw new AppError('You don\'t have permission to delete this job.', false, 403)
    }

    const filesToDelete = await this.jobRepository.delete(deleteJobDto.id)

    filesToDelete.files?.forEach(async resume => {
      if (resume.file) {
        await this.storageService.delete(resume.file, false)
      }
    })
  }
}
