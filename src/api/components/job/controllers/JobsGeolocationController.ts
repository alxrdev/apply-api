import { Request, Response, NextFunction } from 'express'
import FindJobsByGeolocationUseCase from '../useCases/FindJobsByGeolocationUseCase'
import FindJobsByGeolocationFiltersDTO from '../dtos/FindJobsByGeolocationFiltersDTO'
import JobMapper from '../utils/JobMapper'

export default class JobsGeolocationController {
  constructor (private readonly findJobsByGeolocation: FindJobsByGeolocationUseCase) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const { zipcode, distance } = request.params
    const { title, description, company, industry, jobType, minEducation, page, limit, sortBy, sortOrder } = request.query

    try {
      const result = await this.findJobsByGeolocation.find({ zipcode, distance: Number(distance), title, description, company, industry, jobType, minEducation, page, limit, sortBy, sortOrder } as FindJobsByGeolocationFiltersDTO)

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
