import { User, UserResponse } from '../entities'
import { host } from '../../../configs/base'

export default class UserMapper {
  public static fromUserToUserResponse (user: User, safe: boolean = true): UserResponse {
    const response: UserResponse = {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: `${host}/api/avatar/${user.avatar}`,
      createdAt: user.createdAt
    }

    if (!safe) response.email = user.email

    return response
  }
}
