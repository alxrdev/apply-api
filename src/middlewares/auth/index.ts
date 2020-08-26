import { Request, Response, NextFunction } from 'express'
import jsonWebToken from 'jsonwebtoken'
import AuthenticationError from '../../components/users/errors/AuthenticationError'
import AppError from '../../errors/AppError'
import dotenv from 'dotenv'

dotenv.config()

const isAuthenticated = (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers as { authorization: string }

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthenticationError('User not authenticated.', false, 401)
  }

  const token = authorization.split(' ')[1]

  if (!process.env.JWT_SECRET) {
    throw new AppError('Jwt env variables not loaded.')
  }

  try {
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET as string)

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
