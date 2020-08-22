import IJobRepository from '../repositories/IJobRepository'
import Job from '../entities/Job'
import ListJobsFiltersDTO from '../dtos/ListJobsFiltersDTO'
import CollectionResponse from '../entities/CollectionResponse'
import collectionResultPagination from '../../../../utils/collectionResultPagination'
import validateClassParameters from '../../../../utils/validateClassParameters'

export default class ListJobsUseCase {
  constructor (
    private readonly jobRepository: IJobRepository
  ) {}

  public async listJobs (filtersDto: ListJobsFiltersDTO): Promise<CollectionResponse<Job>> {
    await validateClassParameters(filtersDto)

    const filters = this.setupFilters(filtersDto)

    const result = await this.jobRepository.fetchAll(filters)

    const baseUrl = `/api/jobs?title=${filters.title}&description=${filters.description}&company=${filters.company}&jobType=${filters.jobType}&minEducation=${filters.minEducation}&industry=${filters.industry}`

    const [previous, next] = collectionResultPagination(result.count, filters.page, filters.limit, filters.sortBy, filters.sortOrder, baseUrl)

    result.previous = previous
    result.next = next

    return result
  }

  private setupFilters (filters: ListJobsFiltersDTO): ListJobsFiltersDTO {
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
