import IJobRepository from '../repositories/IJobRepository'
import Job from '../entities/Job'
import ListJobsFiltersDTO from '../dtos/ListJobsFiltersDTO'
import CollectionResponse from '../entities/CollectionResponse'
import collectionResultPagination from '../../../../utils/collectionResultPagination'

export default class ListJobsUseCase {
  private jobRepository: IJobRepository

  constructor (jobRepository: IJobRepository) {
    this.jobRepository = jobRepository
  }

  public async listJobs (filtersDto: ListJobsFiltersDTO): Promise<CollectionResponse<Job>> {
    const filters = this.validateFilters(filtersDto)

    const result = await this.jobRepository.fetchAll(filters)

    const baseUrl = `/api/jobs?title=${filters.title}&description=${filters.description}&company=${filters.company}&jobType=${filters.jobType}&minEducation=${filters.minEducation}&industry=${filters.industry}`

    const [previous, next] = collectionResultPagination(result.count, filters.page, filters.limit, filters.sortBy, filters.sortOrder, baseUrl)

    result.previous = previous
    result.next = next

    return result
  }

  private validateFilters (filters: ListJobsFiltersDTO) {
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
      sortOrder
    }
  }
}
