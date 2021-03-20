import { injectable, inject } from 'tsyringe'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import IStorageService from '@providers/storage/interfaces/IStorageService'
import UpdateUserAvatarDTO from '@modules/users/dtos/UpdateUserAvatarDTO'
import validateClassParameters from '@utils/validateClassParameters'
import { AppError } from '@errors/index'

@injectable()
export default class UpdateUserAvatarUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('AvatarStorageService')
    private readonly storageService: IStorageService
  ) {}

  public async execute (updateUserAvatarDto: UpdateUserAvatarDTO) {
    try {
      await validateClassParameters(updateUserAvatarDto)

      if (updateUserAvatarDto.id !== updateUserAvatarDto.authId) {
        throw new AppError('You don\'t have permission to update this avatar.', false, 403)
      }

      const user = await this.userRepository.findById(updateUserAvatarDto.id)

      const oldAvatar = user.avatar
      user.avatar = updateUserAvatarDto.avatar

      await this.userRepository.update(user)

      await this.storageService.save(updateUserAvatarDto.avatar)

      if (oldAvatar !== 'default.jpg' && oldAvatar !== '') {
        await this.storageService.delete(oldAvatar, false)
      }
    } catch (error) {
      if (updateUserAvatarDto.avatar && updateUserAvatarDto.avatar !== '') await this.storageService.delete(updateUserAvatarDto.avatar, true)
      throw error
    }
  }
}
