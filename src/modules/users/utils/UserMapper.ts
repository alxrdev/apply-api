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
}
