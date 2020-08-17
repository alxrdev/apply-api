import { Request, Response } from 'express'
import FindJobByGeolocation from '../useCases/FindJobsByGeolocation'
import JobRepository from '../repositories/mongodb/JobRepository'
import JobMapper from '../utils/JobMapper'

export default class JobsGeolocationController {
  public async index (request: Request, response: Response) {
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
    } catch (err) {
      return response.status(400).json({
        success: false,
        message: 'Error on listing jobs',
        error_code: 400,
        error_message: err.message
      })
    }
  }
}
