import { AppError } from '@errors/index'
import IAuthProvider from './interfaces/IAuthProvider'
import ITokenBasedAuthProvider from './interfaces/ITokenBasedAuthProvider'

export default class FakeAuthProvider implements IAuthProvider, ITokenBasedAuthProvider {
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

    return { id: '1', role: 'employer', exp: new Date(Date.now()).getTime() / 1000 }
  }
}
