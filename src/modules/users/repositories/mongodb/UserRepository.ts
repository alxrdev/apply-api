import IUserRepository from '@modules/users/repositories/IUserRepository'
import { User } from '@modules/users/entities'
import userModel from '@providers/database/mongodb/schemas/user'
import { UserNotFoundError } from '@modules/users/errors'
import UserMapper from '@modules/users/utils/UserMapper'

export default class UserRepository implements IUserRepository {
  public async findById (id: string): Promise<User> {
    const user = await userModel.findOne({ _id: id })

    if (user === null) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    return UserMapper.fromPersistenceToUser(user)
  }

  public async findByEmail (email: string): Promise<User> {
    const user = await userModel.findOne({ email })

    if (user === null) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    return UserMapper.fromPersistenceToUser(user)
  }

  public async findByResetPasswordToken (token: string): Promise<User> {
    const user = await userModel.findOne({ resetPasswordToken: token })

    if (user === null) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    return UserMapper.fromPersistenceToUser(user)
  }

  public async create (user: User): Promise<User> {
    await userModel.create(UserMapper.fromUserToPersistence(user))
    return user
  }

  public async update (user: User): Promise<User> {
    await userModel.updateOne({ _id: user.id }, UserMapper.fromUserToPersistence(user))
    return user
  }

  public async delete (id: string): Promise<void> {
    const job = await userModel.findOne({ _id: id })

    if (!job) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    await job.remove()
  }
}
