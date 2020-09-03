import { User } from '../../users/entities'

export default interface IAuthResponse {
  user: User
  token: string
}
