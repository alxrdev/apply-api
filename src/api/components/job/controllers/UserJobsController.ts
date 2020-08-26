import ListPublishedJobsByUserUseCase from '../useCases/ListPublishedJobsByUserUseCase'
import { Request, Response, NextFunction } from 'express'
import { plainToClass } from 'class-transformer'
import ListPublishedJobsByUserDTO from '../dtos/ListPublishedJobsByUserDTO'
import JobMapper from '../utils/JobMapper'

export default class UserJobsController {
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
