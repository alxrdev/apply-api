import { IUser } from '@src/providers/database/mongodb/schemas/user'
import { User, UserResponse } from '../entities'

export default class UserMapper {
  public static fromUserToUserResponse (user: User, safe: boolean = true): UserResponse {
    const response: UserResponse = {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: `https://holoscdh.com.br/wp-content/plugins/imageuploader/avatar/${user.avatar}`,
      headline: user.headline,
      address: user.address,
      bio: user.bio,
      createdAt: user.createdAt
    }

    if (!safe) response.email = user.email

    return response
  }

  public static fromPersistenceToUser (persistence: IUser) : User {
    return User.create({
      name: persistence.name,
      email: persistence.email,
      password: persistence.password,
      role: persistence.role,
      avatar: persistence.avatar,
      headline: persistence.headline || '',
      address: persistence.address || '',
      bio: persistence.bio || '',
      createdAt: persistence.createdAt
    }, persistence._id)
  }

  public static fromUserToPersistence (user: User) {
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
