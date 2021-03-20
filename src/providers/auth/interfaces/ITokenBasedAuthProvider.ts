import { User } from '@modules/users/entities'

export interface Payload {
  id: string
  role: string
  exp: number
}

export default interface ITokenBasedAuthProvider {
  generateToken(entity: User) : string
  decodeToken(token: string) : Payload
}
