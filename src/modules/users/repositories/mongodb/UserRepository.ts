import IUserRepository from '../IUserRepository'
import { User } from '../../entities'
import userModel, { IUser } from '../../../../services/database/mongodb/schemas/user'
import { UserNotFouldError } from '../../errors'

export default class UserRepository implements IUserRepository {
  public async findById (id: string): Promise<User> {
    const user = await userModel.findOne({ _id: id })

    if (user === null) {
      throw new UserNotFouldError('User not fould.', false, 404)
    }

    return UserRepository.userDocumentToUser(user)
  }

  public async findByEmail (email: string): Promise<User> {
    const user = await userModel.findOne({ email })

    if (user === null) {
      throw new UserNotFouldError('User not fould.', false, 404)
    }

    return UserRepository.userDocumentToUser(user)
  }

  public async findByResetPasswordToken (token: string): Promise<User> {
    const user = await userModel.findOne({ resetPasswordToken: token })

    if (user === null) {
      throw new UserNotFouldError('User not fould.', false, 404)
    }

    return UserRepository.userDocumentToUser(user)
  }

  public async create (user: User): Promise<User> {
    await userModel.create(UserRepository.userToUserDocument(user))
    return user
  }

  public async update (user: User): Promise<User> {
    await userModel.updateOne({ _id: user.id }, UserRepository.userToUserDocument(user))
    return user
  }

  public async delete (id: string): Promise<void> {
    const job = await userModel.findOne({ _id: id })

    if (!job) {
      throw new UserNotFouldError('User not found.', false, 404)
    }

    await job.remove()
  }

  public static userDocumentToUser (user: IUser): User {
    return new User(
      user._id,
      user.name,
      user.email,
      user.role,
      user.avatar,
      user.password,
      user.headline || '',
      user.address || '',
      user.bio || '',
      user.createdAt,
      user.resetPasswordToken,
      user.resetPasswordExpire
    )
  }

  public static userToUserDocument (user: User) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      password: user.password,
      headline: user.headline,
      address: user.address,
      bio: user.bio,
      createdAt: user.createdAt,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpire: user.resetPasswordExpire
    }
  }
}
