import IUserRepository from '../IUserRepository'
import User from '../../entities/User'
import userModel, { IUser } from '../../../../../services/mongodb/schemas/user'
import UserNotFouldError from '../../errors/UserNotFouldError'

export default class UserRepository implements IUserRepository {
  public async findById (id: string): Promise<User> {
    const user = await userModel.findOne({ _id: id })

    if (user === null) {
      throw new UserNotFouldError('User not fould.', false, 404)
    }

    return this.userDocumentToUser(user)
  }

  public async findByEmail (email: string): Promise<User> {
    const user = await userModel.findOne({ email })

    if (user === null) {
      throw new UserNotFouldError('User not fould.', false, 404)
    }

    return this.userDocumentToUser(user)
  }

  public async create (user: User): Promise<User> {
    await userModel.create(this.userToUserDocument(user))
    return user
  }

  public async update (user: User): Promise<User> {
    await userModel.update({ _id: user.id }, this.userToUserDocument(user))
    return user
  }

  public async delete (id: string): Promise<void> {
    await userModel.deleteOne({ _id: id })
  }

  private userDocumentToUser (user: IUser): User {
    return new User(
      user._id,
      user.name,
      user.email,
      user.role,
      user.password,
      user.createdAt,
      user.resetPasswordToken,
      user.resetPasswordExpire
    )
  }

  private userToUserDocument (user: User) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
      createdAt: user.createdAt,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpire: user.resetPasswordExpire
    }
  }
}
