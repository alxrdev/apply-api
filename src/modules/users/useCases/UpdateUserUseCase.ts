import { inject, injectable } from 'tsyringe'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import { UpdateUserDTO } from '@modules/users/dtos'
import { User } from '@modules/users/entities'
import validateClassParameters from '@utils/validateClassParameters'
import { AppError } from '@errors/index'

@injectable()
export default class UpdateUserUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  public async execute (userDto: UpdateUserDTO): Promise<User> {
    await validateClassParameters(userDto)

    if (userDto.authUserId !== userDto.id) {
      throw new AppError('You don\'t have permission to update this user.', false, 403)
    }

    const userToUpdate = await this.userRepository.findById(userDto.id)

    userToUpdate.name = userDto.name
    userToUpdate.headline = userDto.headline
    userToUpdate.address = userDto.address
    userToUpdate.bio = userDto.bio

    return await this.userRepository.update(userToUpdate)
  }
}
