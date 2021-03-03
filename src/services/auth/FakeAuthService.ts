import { AppError } from '@errors/index'
import IAuthService from './interfaces/IAuthService'
import ITokenBasedAuthService from './interfaces/ITokenBasedAuthService'

export default class FakeAuthService implements IAuthService, ITokenBasedAuthService {
  authenticateUser (): string {
    return this.generateToken()
  }

  generateToken () : string {
    return 'myFakeToken'
  }

  decodeToken (token: string) {
    if (token !== 'myFakeToken') {
      throw new AppError('error')
    }

    return { id: '1', role: 'employer', exp: Date.now() }
  }
}
