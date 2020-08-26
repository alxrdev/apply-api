import { injectable, inject } from 'tsyringe'

import IUserRepository from '../repositories/IUserRepository'
import IJobRepository from '../../jobs/repositories/IJobRepository'
import IStorageService from '../../../services/storage/interfaces/IStorageService'
import { DeleteUserDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'
import { AppError } from '../../../errors'

@injectable()
export default class DeleteUserUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('JobRepository')
    private readonly jobRepository: IJobRepository,

    @inject('DiskStorageService')
    private readonly storageService: IStorageService
  ) {}

  public async delete (userDto: DeleteUserDTO): Promise<void> {
    await validateClassParameters(userDto)

    if (userDto.id !== userDto.authUserId) {
      throw new AppError('You don\'t have permission to delete this user.', false, 403)
    }

    await this.userRepository.delete(userDto.id)

    const filesToDelete = await this.jobRepository.removeApplyToJobs(userDto.id)

    filesToDelete.files?.forEach(async resume => {
      if (resume.file) {
        await this.storageService.delete(resume.file, false)
      }
    })
  }
}
