import { container } from 'tsyringe'

import { User } from '@modules/users/entities'
import ITokenBasedAuthProvider from '@providers/auth/interfaces/ITokenBasedAuthProvider'

export const generateToken = (id: string, role: string) : string => {
  const authProvider : ITokenBasedAuthProvider = container.resolve('AuthProvider')
  return authProvider.generateToken({ id, role } as User)
}
