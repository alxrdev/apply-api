import { injectable } from 'tsyringe'
import { Response, Request, NextFunction } from 'express'

import { ShowUserUseCase, CreateUserUseCase, DeleteUserUseCase, UpdateUserUseCase } from '../useCases'
import { CreateUserDTO, DeleteUserDTO, UpdateUserDTO } from '../dtos'

import UserMapper from '../utils/UserMapper'
import { plainToClass } from 'class-transformer'

@injectable()
export default class UsersController {
  constructor (
    private readonly showUserUseCase: ShowUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  public show = async (request: Request, response: Response, next: NextFunction) => {
    const { idOrEmail } = request.params as { idOrEmail: string }

    try {
      const user = await this.showUserUseCase.execute(idOrEmail)

      return response.status(200).json({
        success: true,
        message: 'Show user',
        data: UserMapper.fromUserToUserResponse(user)
      })
    } catch (error) {
      next(error)
    }
  }

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const userDto = plainToClass(CreateUserDTO, request.body)

    try {
      const user = await this.createUserUseCase.execute(userDto)

      return response.status(201).json({
        success: true,
        message: 'User created',
        data: UserMapper.fromUserToUserResponse(user)
      })
    } catch (error) {
      next(error)
    }
  }

  public update = async (request: Request, response: Response, next: NextFunction) => {
    const userDto = plainToClass(UpdateUserDTO, { ...request.body, ...request.params, authUserId: request.user.id })

    try {
      const user = await this.updateUserUseCase.execute(userDto)

      return response.status(201).json({
        success: true,
        message: 'User updated',
        data: UserMapper.fromUserToUserResponse(user)
      })
    } catch (error) {
      next(error)
    }
  }

  public delete = async (request: Request, response: Response, next: NextFunction) => {
    const userDto = plainToClass(DeleteUserDTO, { ...request.params, authUserId: request.user.id })

    try {
      await this.deleteUserUseCase.execute(userDto)

      return response.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
