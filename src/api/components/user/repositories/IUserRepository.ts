import User from '../entities/User'

export default interface IUserRepository {
  findById (id: string): Promise<User>
  findByEmail (email: string): Promise<User>
  findByResetPasswordToken(token: string): Promise<User>
  create (user: User): Promise<User>
  update (user: User): Promise<User>
  delete (id: string): Promise<void>
}
