import { Response, Request, NextFunction } from 'express'
import CreateUserUseCase from '../useCases/CreateUserUseCase'
import ShowUserUseCase from '../useCases/ShowUserUseCase'
import CreateUserDTO from '../dtos/CreateUserDTO'
import UserMapper from '../utils/UserMapper'
import { plainToClass } from 'class-transformer'

export default class UsersController {
  constructor (
    private readonly showUserUseCase: ShowUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  public show = async (request: Request, response: Response, next: NextFunction) => {
    const { idOrEmail } = request.params as { idOrEmail: string }

    try {
      const user = await this.showUserUseCase.show(idOrEmail)

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
      const user = await this.createUserUseCase.create(userDto)

      return response.status(201).json({
        success: true,
        message: 'User created',
        data: UserMapper.fromUserToUserResponse(user)
      })
    } catch (error) {
      next(error)
    }
  }
}
