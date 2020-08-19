import { Request, Response, NextFunction } from 'express'
import FindJobByGeolocation from '../useCases/FindJobsByGeolocation'
import JobRepository from '../repositories/mongodb/JobRepository'
import JobMapper from '../utils/JobMapper'

export default class JobsGeolocationController {
  public async index (request: Request, response: Response, next: NextFunction) {
    const { zipcode, distance } = request.params

    try {
      const findJobsByGeolocation = new FindJobByGeolocation(new JobRepository())

      const jobs = await findJobsByGeolocation.find(zipcode, Number(distance))

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
