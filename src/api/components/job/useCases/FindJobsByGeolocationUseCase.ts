import IJobRepository from '../repositories/IJobRepository'
import geoCoder from '../../../../utils/geocoder'
import Job from '../entities/Job'
import FindJobsByGeolocationFiltersDTO from '../dtos/FindJobsByGeolocationFiltersDTO'
import CollectionResponse from '../entities/CollectionResponse'
import collectionResultPagination from '../../../../utils/collectionResultPagination'

export default class FindJobsByGeolocationUseCase {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async find (filtersDto: FindJobsByGeolocationFiltersDTO): Promise<CollectionResponse<Job>> {
    const filters = this.validateFilters(filtersDto)

    const location = await geoCoder.geocode(filters.zipcode)

    const latitude = location[0].latitude ?? 0
    const longitude = location[0].longitude ?? 0

    const radius = filters.distance / 3963

    const result = await this.jobRepository.fetchByGeolocation(latitude, longitude, radius, filters)

    const baseUrl = `/api/jobs/${filters.zipcode}/${filters.distance}?title=${filters.title}&description=${filters.description}&company=${filters.company}&jobType=${filters.jobType}&minEducation=${filters.minEducation}&industry=${filters.industry}`

    const [previous, next] = collectionResultPagination(result.count, filters.page, filters.limit, filters.sortBy, filters.sortOrder, baseUrl)

    result.previous = previous
    result.next = next

    return result
  }

  private validateFilters (filters: FindJobsByGeolocationFiltersDTO) {
    const industryString = (filters.industry) ? String(filters.industry).split(',') : ['']

    const industryRegex = industryString.map((industry: string) => RegExp(`^${industry}`))

    filters.limit = (filters.limit) ? Number(filters.limit) : 10
    filters.limit = (filters.limit < 1) ? 1 : filters.limit
    filters.limit = (filters.limit > 20) ? 20 : filters.limit

    filters.sortBy = filters.sortBy ?? 'postingDate'

    const sortOptions = ['position', 'salary', 'postingDate']
    const sortBy = (!sortOptions.includes(filters.sortBy)) ? 'postingDate' : filters.sortBy

    filters.sortOrder = filters.sortOrder ?? 'asc'

    const sortOrderOptions = ['asc', 'desc']
    const sortOrder = (!sortOrderOptions.includes(filters.sortOrder)) ? 'asc' : filters.sortOrder

    return {
      title: filters.title ?? '',
      description: filters.description ?? '',
      company: filters.company ?? '',
      jobType: filters.jobType ?? '',
      minEducation: filters.minEducation ?? '',
      industry: industryString,
      industryRegex: industryRegex,
      limit: filters.limit,
      page: (filters.page) ? Number(filters.page) : 1,
      sortBy,
      sortOrder,
      zipcode: (filters.zipcode) ?? '',
      distance: (filters.distance) ? Number(filters.distance) : 55
    }
  }
}
