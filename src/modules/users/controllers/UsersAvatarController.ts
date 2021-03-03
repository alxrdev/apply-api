import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import UpdateUserAvatarUseCase from '../useCases/UpdateUserAvatarUseCase'
import { plainToClass } from 'class-transformer'
import UpdateUserAvatarDTO from '../dtos/UpdateUserAvatarDTO'

@injectable()
export default class UsersAvatarController {
  constructor (
    private readonly updateUserAvatarUseCase: UpdateUserAvatarUseCase
  ) {}

  public update = async (request: Request, response: Response, next: NextFunction) => {
    const updateAvatarDto = plainToClass(UpdateUserAvatarDTO, { ...request.params, authId: request.user.id, avatar: (request.file) ? request.file.filename : '' })

    try {
      await this.updateUserAvatarUseCase.execute(updateAvatarDto)
      return response.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}
