import { injectable, inject } from 'tsyringe'

import IUserRepository from '../repositories/IUserRepository'
import { User } from '../entities'
import { isEmail } from 'class-validator'

@injectable()
export default class ShowUserUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  public async show (idOrEmail: string): Promise<User> {
    const user = (isEmail(idOrEmail))
      ? await this.userRepository.findByEmail(idOrEmail)
      : await this.userRepository.findById(idOrEmail)

    return user
  }
}
