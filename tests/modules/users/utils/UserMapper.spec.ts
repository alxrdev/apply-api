import { User } from "@modules/users/entities"
import UserMapper from "@modules/users/utils/UserMapper"

describe('Test the UserMapper class', () => {
  it('Should convert an User object to an UserResponse', () => {
    const date = new Date(Date.now())
    const user = new User('1', 'John Doe', 'user@email.com', 'user', 'avatar.jpg', 'mypassword', 'my headline', '', '', date)
    const userResponse = UserMapper.fromUserToUserResponse(user, false)

    expect(userResponse).toHaveProperty('id', '1')
    expect(userResponse).toHaveProperty('name', 'John Doe')
    expect(userResponse).toHaveProperty('email', 'user@email.com')
    expect(userResponse).toHaveProperty('role', 'user')
    expect(userResponse).toHaveProperty('avatar', 'https://holoscdh.com.br/wp-content/plugins/imageuploader/avatar/avatar.jpg')
    expect(userResponse).toHaveProperty('headline', 'my headline')
    expect(userResponse).toHaveProperty('address', '')
    expect(userResponse).toHaveProperty('bio', '')
    expect(userResponse).toHaveProperty('createdAt', date)
  })

  it('Should convert an User object to an UserResponse without email field', () => {
    const date = new Date(Date.now())
    const user = new User('1', 'John Doe', 'user@email.com', 'user', 'avatar.jpg', 'mypassword', 'my headline', '', '', date)
    const userResponse = UserMapper.fromUserToUserResponse(user, true)

    expect(userResponse).toHaveProperty('id', '1')
    expect(userResponse).toHaveProperty('name', 'John Doe')
    expect(userResponse).not.toHaveProperty('email', 'user@email.com')
    expect(userResponse).toHaveProperty('role', 'user')
    expect(userResponse).toHaveProperty('avatar', 'https://holoscdh.com.br/wp-content/plugins/imageuploader/avatar/avatar.jpg')
    expect(userResponse).toHaveProperty('headline', 'my headline')
    expect(userResponse).toHaveProperty('address', '')
    expect(userResponse).toHaveProperty('bio', '')
    expect(userResponse).toHaveProperty('createdAt', date)
  })
})