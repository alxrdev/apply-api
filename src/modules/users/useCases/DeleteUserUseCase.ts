import { injectable, inject } from 'tsyringe'

import IUserRepository from '../repositories/IUserRepository'
import IJobRepository from '../../jobs/repositories/IJobRepository'
import IStorageService from '../../../services/storage/interfaces/IStorageService'
import { DeleteUserDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'

@injectable()
export default class DeleteUserUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('JobRepository')
    private readonly jobRepository: IJobRepository,

    @inject('ResumeStorageService')
    private readonly storageService: IStorageService
  ) {}

  public async execute (userDto: DeleteUserDTO): Promise<void> {
    await validateClassParameters(userDto)

    const user = await this.userRepository.findById(userDto.id)

    await this.userRepository.delete(userDto.id)

    if (user.avatar !== 'default.jpg') {
      await this.storageService.delete(user.avatar, false)
    }

    if (user.role === 'user') {
      const filesToDelete = await this.jobRepository.removeApplyToJobs(userDto.id)

      filesToDelete.files?.forEach(async resume => {
        if (resume.file) {
          await this.storageService.delete(resume.file, false)
        }
      })
    }
  }
}
