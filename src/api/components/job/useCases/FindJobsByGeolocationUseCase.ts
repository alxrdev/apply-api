import IJobRepository from '../repositories/IJobRepository'
import CollectionResponse from '../entities/CollectionResponse'
import Job from '../entities/Job'
import FindJobsByGeolocationFiltersDTO from '../dtos/FindJobsByGeolocationFiltersDTO'
import geoCoder from '../../../../utils/geocoder'
import collectionResultPagination from '../../../../utils/collectionResultPagination'

export default class FindJobsByGeolocationUseCase {
  constructor (
    private readonly jobRepository: IJobRepository
  ) {}

  public async find (filtersDto: FindJobsByGeolocationFiltersDTO): Promise<CollectionResponse<Job>> {
    const filters = this.setupFilters(filtersDto)

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

  private setupFilters (filters: FindJobsByGeolocationFiltersDTO) {
    const industryArray = filters.industry.split(',')

    const industryRegex = industryArray.map((industry: string) => RegExp(`^${industry}`))

    filters.page = (filters.page < 1) ? 1 : filters.page

    filters.limit = (filters.limit < 1) ? 1 : filters.limit
    filters.limit = (filters.limit > 20) ? 20 : filters.limit

    const sortOptions = ['position', 'salary', 'postingDate']
    const sortBy = (!sortOptions.includes(filters.sortBy)) ? 'postingDate' : filters.sortBy

    const sortOrderOptions = ['asc', 'desc']
    const sortOrder = (!sortOrderOptions.includes(filters.sortOrder)) ? 'asc' : filters.sortOrder

    return {
      ...filters,
      industryRegex,
      sortBy,
      sortOrder
    }
  }
}
