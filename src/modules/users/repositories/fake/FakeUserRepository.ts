import IUserRepository from '@modules/users/repositories/IUserRepository'
import { User } from '@modules/users/entities'
import { UserNotFoundError } from '@modules/users/errors'

export default class FakeUserRepository implements IUserRepository {
  private users: User[]

  public constructor () {
    this.users = []
  }

  public async findById (id: string): Promise<User> {
    const user = this.users.find(u => u.id === id)

    if (!user) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    return user
  }

  public async findByEmail (email: string): Promise<User> {
    const user = this.users.find(u => u.email === email)

    if (!user) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    return user
  }

  public async findByResetPasswordToken (token: string): Promise<User> {
    const user = this.users.find(u => u.resetPasswordToken === token)

    if (!user) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    return user
  }

  public async create (user: User): Promise<User> {
    this.users.push(user)
    return user
  }

  public async update (user: User): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === user.id)
    this.users[userIndex] = user
    return user
  }

  public async delete (id: string): Promise<void> {
    const user = this.users.find(u => u.id === id)

    if (!user) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    this.users = this.users.filter(u => u.id !== id)
  }
}
