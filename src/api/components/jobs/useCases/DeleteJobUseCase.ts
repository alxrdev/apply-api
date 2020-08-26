import IJobRepository from '../repositories/IJobRepository'
import IStorageService from '../../../../services/storage/interfaces/IStorageService'
import AppError from '../../../../errors/AppError'
import DeleteJobDTO from '../dtos/DeleteJobDTO'
import validateClassParameters from '../../../../utils/validateClassParameters'

export default class DeleteJobUseCase {
  constructor (
    private readonly jobRepository: IJobRepository,
    private readonly storageService: IStorageService
  ) {}

  public async delete (deleteJobDto: DeleteJobDTO): Promise<void> {
    await validateClassParameters(deleteJobDto)

    const job = await this.jobRepository.findById(deleteJobDto.id)

    if (job.getUserId() !== deleteJobDto.authId) {
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
