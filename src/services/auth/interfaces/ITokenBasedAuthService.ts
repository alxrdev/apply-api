import { User } from "@modules/users/entities";

export interface Payload {
  id: string
  rule: string
  exp: number
}

export default interface ITokenBasedAuthService {
  generateToken(entity: User) : string
  decodeToken(token: string) : Payload
}