import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { RefreshTokenUseCase } from '../useCases'
import UserMapper from '../../users/utils/UserMapper'
import { nodeEnvironment } from '@src/configs/base'

@injectable()
export default class RefreshTokenController {
  constructor (
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  public post = async (request: Request, response: Response, next: NextFunction) => {
    const jwtCookie = request.cookies['@Apply:token'] as string
    const { authorization } = request.headers as { authorization: string }

    try {
      const token = jwtCookie ?? authorization.split(' ')[1]

      const result = await this.refreshTokenUseCase.execute(token)

      // config the cookie expires date
      const cookieExpiresDate = () => {
        const date = new Date()
        date.setDate(date.getDate() + 15)
        return date
      }

      return response.status(200)
        .cookie('@Apply:token', result.token, { httpOnly: true, path: '/', expires: cookieExpiresDate(), sameSite: 'none', secure: (nodeEnvironment === 'production') })
        .json({
          success: true,
          message: 'Token refreshed.',
          data: {
            token: result.token,
            user: UserMapper.fromUserToUserResponse(result.user)
          }
        })
    } catch (error) {
      next(error)
    }
  }
}
