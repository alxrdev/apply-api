import { Request, Response, NextFunction } from 'express'
import jsonWebToken from 'jsonwebtoken'
import AuthenticationError from '../api/components/user/errors/AuthenticationError'
import AppError from '../errors/AppError'
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

    const { id } = decoded as { id: string }

    request.user = { id }

    return next()
  } catch (error) {
    throw new AuthenticationError('Invalid JWT token.', false, 401)
  }
}

export default isAuthenticated
