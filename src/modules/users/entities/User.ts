import UserBuilder from './UserBuilder'

export default class User {
  public id: string
  public name: string
  public email: string
  public role: string
  public avatar: string
  public password: string
  public headline: string
  public address: string
  public bio: string
  public createdAt: Date
  public resetPasswordToken?: string
  public resetPasswordExpire?: Date

  constructor (id: string, name: string, email: string, role: string, avatar: string, password: string, headline: string, address: string, bio: string, createdAt: Date, resetPasswordToken?: string, resetPasswordExpire?: Date) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
    this.avatar = avatar
    this.password = password
    this.headline = headline
    this.address = address
    this.bio = bio
    this.createdAt = createdAt
    this.resetPasswordToken = resetPasswordToken
    this.resetPasswordExpire = resetPasswordExpire
  }

  public static builder () : UserBuilder {
    return new UserBuilder()
  }
}
