import { Entity } from '@modules/shared/entities'
import UserBuilder from '@modules/users/utils/UserBuilder'

interface IUserProps {
  name: string
  email: string
  role: string
  avatar: string
  password: string
  headline: string
  address: string
  bio: string
  createdAt: Date
  resetPasswordToken?: string
  resetPasswordExpire?: Date
}

export default class User extends Entity<IUserProps> {
  private constructor (props: IUserProps, id?: string) {
    super(props, id)
  }

  static create (props: IUserProps, id?: string) {
    return new User(props, id)
  }

  static builder () {
    return new UserBuilder()
  }

  get name () : string {
    return this.props.name
  }

  set name (name: string) {
    this.props.name = name
  }

  get email () : string {
    return this.props.email
  }

  set email (email: string) {
    this.props.email = email
  }

  get role () : string {
    return this.props.role
  }

  set role (role: string) {
    this.props.role = role
  }

  get avatar () : string {
    return this.props.avatar
  }

  set avatar (avatar: string) {
    this.props.avatar = avatar
  }

  get password () : string {
    return this.props.password
  }

  set password (password: string) {
    this.props.password = password
  }

  get headline () : string {
    return this.props.headline
  }

  set headline (headline: string) {
    this.props.headline = headline
  }

  get bio () : string {
    return this.props.bio
  }

  set bio (bio: string) {
    this.props.bio = bio
  }

  get address () : string {
    return this.props.address
  }

  set address (address: string) {
    this.props.address = address
  }

  get createdAt () : Date {
    return this.props.createdAt
  }

  set createdAt (createdAt: Date) {
    this.props.createdAt = createdAt
  }

  get resetPasswordToken () : string | undefined {
    return this.props.resetPasswordToken
  }

  set resetPasswordToken (resetPasswordToken: string | undefined) {
    this.props.resetPasswordToken = resetPasswordToken
  }

  get resetPasswordExpire () : Date | undefined {
    return this.props.resetPasswordExpire || undefined
  }

  set resetPasswordExpire (resetPasswordExpire: Date | undefined) {
    this.props.resetPasswordExpire = resetPasswordExpire
  }
}
