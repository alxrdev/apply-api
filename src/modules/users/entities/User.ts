export default class User {
  public id: string
  public name: string
  public email: string
  public role: string
  public avatar: string
  public password: string
  public createdAt: Date
  public resetPasswordToken?: string
  public resetPasswordExpire?: Date

  constructor (id: string, name: string, email: string, role: string, avatar: string, password: string, createdAt: Date = new Date(), resetPasswordToken?: string, resetPasswordExpire?: Date) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
    this.avatar = avatar
    this.password = password
    this.createdAt = createdAt
    this.resetPasswordToken = resetPasswordToken
    this.resetPasswordExpire = resetPasswordExpire
  }
}
