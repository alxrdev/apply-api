import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import { ListPublishedJobsByUserUseCase } from '../useCases'
import { ListPublishedJobsByUserDTO } from '../dtos'

import { plainToClass } from 'class-transformer'
import JobMapper from '../utils/JobMapper'

@injectable()
export default class UsersJobsController {
  constructor (
    private readonly listPublishedJobsByUserUseCase: ListPublishedJobsByUserUseCase
  ) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const userDto = plainToClass(ListPublishedJobsByUserDTO, request.params)

    try {
      const jobs = await this.listPublishedJobsByUserUseCase.list(userDto)

      return response.status(200).json({
        success: true,
        message: 'All published jobs.',
        data: JobMapper.fromJobArrayToJobResponseArray(jobs)
      })
    } catch (error) {
      next(error)
    }
  }
}
