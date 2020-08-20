import { Request, Response, NextFunction } from 'express'
import FindJobsByGeolocation from '../useCases/FindJobsByGeolocation'
import JobMapper from '../utils/JobMapper'

export default class JobsGeolocationController {
  constructor (private readonly findJobsByGeolocation: FindJobsByGeolocation) {}

  public index = async (request: Request, response: Response, next: NextFunction) => {
    const { zipcode, distance } = request.params

    try {
      const jobs = await this.findJobsByGeolocation.find(zipcode, Number(distance))

      return response.status(200).json({
        success: true,
        message: 'All jobs in this location.',
        data: {
          jobs: JobMapper.fromJobArrayToJobResponseArray(jobs)
        }
      })
    } catch (error) {
      return next(error)
    }
  }
}
