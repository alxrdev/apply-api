import { container } from 'tsyringe'

import { User } from '@modules/users/entities'
import ITokenBasedAuthService from '@services/auth/interfaces/ITokenBasedAuthService'

export const generateToken = (id: string, role: string) : string => {
  const authService : ITokenBasedAuthService = container.resolve('AuthService')
  return authService.generateToken({ id, role } as User)
}
