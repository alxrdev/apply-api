import IJobRepository from '../repositories/IJobRepository'
import IStorageService from '../../../../services/storage/interfaces/IStorageService'

export default class DeleteJobUseCase {
  constructor (
    private readonly jobRepository: IJobRepository,
    private readonly storageService: IStorageService
  ) {}

  public async delete (id: string): Promise<void> {
    const filesToDelete = await this.jobRepository.delete(id)

    filesToDelete.files?.forEach(async resume => {
      if (resume.file) {
        await this.storageService.delete(resume.file, false)
      }
    })
  }
}
