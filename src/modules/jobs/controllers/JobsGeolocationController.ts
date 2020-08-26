import { injectable } from 'tsyringe'
import { Request, Response, NextFunction } from 'express'

import FindJobsByGeolocationUseCase from '../useCases/FindJobsByGeolocationUseCase'
import FindJobsByGeolocationFiltersDTO from '../dtos/FindJobsByGeolocationFiltersDTO'
import JobMapper from '../utils/JobMapper'
import { plainToClass } from 'class-transformer'

@injectable()
export default class JobsGeolocationController {
  constructor (
    private readonly findJobsByGeolocation: FindJobsByGeolocationUseCase
  ) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const filtersDto = plainToClass(FindJobsByGeolocationFiltersDTO, { ...request.params, ...request.query })

    try {
      const result = await this.findJobsByGeolocation.find(filtersDto)

      return response.status(200).json({
        success: true,
        message: 'All jobs in this location.',
        totalItems: result.count,
        previousPage: result.previous,
        nextPage: result.next,
        data: JobMapper.fromJobArrayToJobResponseArray(result.collection)
      })
    } catch (error) {
      return next(error)
    }
  }
}
