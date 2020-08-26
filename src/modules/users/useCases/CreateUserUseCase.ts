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

  public async create (userDto: CreateUserDTO): Promise<User> {
    await validateClassParameters(userDto)

    validatePasswordAndConfirmPassword(userDto.password, userDto.confirmPassword)

    let userAlreadyExists = false

    try {
      await this.userRepository.findByEmail(userDto.email)
      userAlreadyExists = true
    } catch (error) {}

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError('An user already exists with this same e-mail.', false, 400)
    }

    const password = bcrypt.hashSync(userDto.password, 10)

    const user = new User(uuid(), userDto.name, userDto.email, userDto.role, password)

    return await this.userRepository.create(user)
  }
}
