import { injectable, inject } from 'tsyringe'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'

import IUserRepository from '../repositories/IUserRepository'
import { CreateUserDTO } from '../dtos'
import { User } from '../entities'
import validateClassParameters from '../../../utils/validateClassParameters'
import validatePasswordAndConfirmPassword from '../utils/validatePasswordAndConfirmPassword'
import { UserAlreadyExistsError } from '../errors'

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

    const user = new User(uuid(), userDto.name, userDto.email, userDto.role, 'default.jpg', password, '', '', '')

    return await this.userRepository.create(user)
  }
}
