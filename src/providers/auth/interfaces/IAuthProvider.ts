import { User } from '@modules/users/entities'

export default interface IAuthProvider {
  authenticateUser (user: User): string
}
