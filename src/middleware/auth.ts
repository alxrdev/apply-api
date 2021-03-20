import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'

import { AuthenticationError } from '@modules/auth/errors'
import ITokenBasedAuthProvider from '@src/providers/auth/interfaces/ITokenBasedAuthProvider'

const isAuthenticated = (request: Request, response: Response, next: NextFunction) => {
  const authProvider: ITokenBasedAuthProvider = container.resolve('AuthProvider')

  const jwtCookie = request.cookies['@Apply:token'] as string
  const { authorization } = request.headers as { authorization: string }

  if (!jwtCookie && (!authorization || !authorization.startsWith('Bearer'))) {
    throw new AuthenticationError('User not authenticated.', false, 401)
  }

  try {
    const token = jwtCookie || authorization.split(' ')[1]

    const { id, role } = authProvider.decodeToken(token)

    request.user = { id, role }

    return next()
  } catch (error) {
    throw new AuthenticationError('Invalid JWT token.', false, 401)
  }
}

const authorizedRole = (role: string | Array<string>) =>
  (request: Request, response: Response, next: NextFunction) => {
    if (!role.includes(request.user.role)) {
      throw new AuthenticationError(`Role (${request.user.role}) is not allowed to access this resource.`, false, 403)
    }

    next()
  }

export { isAuthenticated, authorizedRole }
