import { AppError } from "@errors/index";
import { User } from "@modules/users/entities";
import IAuthService from "./interfaces/IAuthService";
import ITokenBasedAuthService from "./interfaces/ITokenBasedAuthService";

export default class FakeAuthService implements IAuthService, ITokenBasedAuthService {
  authenticateUser(user: User): string {
    return this.generateToken(user)
  }

  generateToken(user: User) : string {
    return 'myFakeToken'
  }

  decodeToken(token: string) {
    if (token !== 'myFakeToken') {
      throw new AppError('error')
    }

    return { id: '1', rule: 'employer', exp: Date.now() }
  }
}