import { User } from '../../../modules/users/entities'

export default interface IAuthService {
  authenticateUser (user: User): string
}
