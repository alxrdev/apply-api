import { User, UserResponse } from '../entities'

export default class UserMapper {
  public static fromUserToUserResponse (user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  }
}
