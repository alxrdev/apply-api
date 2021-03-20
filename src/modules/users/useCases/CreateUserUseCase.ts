import { injectable, inject } from 'tsyringe'
import bcrypt from 'bcrypt'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import { CreateUserDTO } from '@modules/users/dtos'
import { User } from '@modules/users/entities'
import validateClassParameters from '@utils/validateClassParameters'
import validatePasswordAndConfirmPassword from '@modules/users/utils/validatePasswordAndConfirmPassword'
import { UserAlreadyExistsError } from '@modules/users/errors'

@injectable()
export default class CreateUserUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  public async execute (userDto: CreateUserDTO): Promise<User> {
    await validateClassParameters(userDto)

    validatePasswordAndConfirmPassword(userDto.password, userDto.confirmPassword)

    try {
      await this.userRepository.findByEmail(userDto.email)
      throw new UserAlreadyExistsError('An user already exists with this same e-mail.', false, 400)
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) throw error
    }

    const password = bcrypt.hashSync(userDto.password, 10)

    const user = User.builder()
      .withName(userDto.name)
      .withEmail(userDto.email)
      .withRole(userDto.role)
      .withPassword(password)
      .build()

    return await this.userRepository.create(user)
  }
}
