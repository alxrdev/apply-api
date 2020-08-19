import IJobRepository from '../repositories/IJobRepository'
import geoCoder from '../../../../utils/geocoder'
import Job from '../entities/Job'

export default class FindJobsByGeolocation {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async find (zipcode: string, distance: number): Promise<Array<Job>> {
    const location = await geoCoder.geocode(zipcode)
    const latitude = location[0].latitude ?? 0
    const longitude = location[0].longitude ?? 0

    const radius = distance / 3963

    const jobs = await this.jobRepository.fetchByGeolocation(latitude, longitude, radius)

    return jobs
  }
}
