import IUserRepository from '../repositories/IUserRepository'
import User from '../entities/User'
import { isEmail } from 'class-validator'

export default class ShowUserUseCase {
  constructor (
    private readonly userRepository: IUserRepository
  ) {}

  public async show (idOrEmail: string): Promise<User> {
    const user = (isEmail(idOrEmail))
      ? await this.userRepository.findByEmail(idOrEmail)
      : await this.userRepository.findById(idOrEmail)

    return user
  }
}
