import { Request, Response, NextFunction } from 'express'
import jsonWebToken from 'jsonwebtoken'

import { authSettings } from '../../services/auth'
import { AuthenticationError } from '../../modules/auth/errors'
import AppError from '../../errors/AppError'

const isAuthenticated = (request: Request, response: Response, next: NextFunction) => {
  const jwtCookie = request.cookies['@Apply:token'] as string
  const { authorization } = request.headers as { authorization: string }

  if (!authSettings.jwtSecret) {
    throw new AppError('Jwt env variables not loaded.')
  }

  if (!jwtCookie && (!authorization || !authorization.startsWith('Bearer'))) {
    throw new AuthenticationError('User not authenticated.', false, 401)
  }

  try {
    const token = jwtCookie || authorization.split(' ')[1]

    const decoded = jsonWebToken.verify(token, authSettings.jwtSecret)

    const { id, role } = decoded as { id: string; role: string }

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
