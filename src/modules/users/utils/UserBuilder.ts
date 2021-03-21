import User from '@modules/users/entities/User'

export default class UserBuilder {
  public id?: string = undefined
  public name: string = ''
  public email: string = ''
  public role: string = 'user'
  public avatar: string = 'default.jpg'
  public password: string = ''
  public headline: string = ''
  public address: string = ''
  public bio: string = ''
  public createdAt: Date = new Date()
  public resetPasswordToken?: string = undefined
  public resetPasswordExpire?: Date = undefined

  public withId (id: string) : UserBuilder {
    this.id = id
    return this
  }

  public withName (name: string) : UserBuilder {
    this.name = name
    return this
  }

  public withEmail (email: string) : UserBuilder {
    this.email = email
    return this
  }

  public withRole (role: string) : UserBuilder {
    this.role = role
    return this
  }

  public withAvatar (avatar: string) : UserBuilder {
    this.avatar = avatar
    return this
  }

  public withPassword (password: string) : UserBuilder {
    this.password = password
    return this
  }

  public withHeadline (headline: string) : UserBuilder {
    this.headline = headline
    return this
  }

  public withAddress (address: string) : UserBuilder {
    this.address = address
    return this
  }

  public withBio (bio: string) : UserBuilder {
    this.bio = bio
    return this
  }

  public withCreatedAt (createdAt: Date) : UserBuilder {
    this.createdAt = createdAt
    return this
  }

  public withResetPasswordToken (resetPasswordToken?: string) : UserBuilder {
    this.resetPasswordToken = resetPasswordToken
    return this
  }

  public withResetPasswordExpire (resetPasswordExpire?: Date) : UserBuilder {
    this.resetPasswordExpire = resetPasswordExpire
    return this
  }

  public build () : User {
    return User.create({
      name: this.name,
      email: this.email,
      role: this.role,
      avatar: this.avatar,
      password: this.password,
      headline: this.headline,
      address: this.address,
      bio: this.bio,
      createdAt: this.createdAt,
      resetPasswordToken: this.resetPasswordToken,
      resetPasswordExpire: this.resetPasswordExpire
    }, this.id)
  }
}
