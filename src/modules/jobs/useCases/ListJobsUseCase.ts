import { injectable, inject } from 'tsyringe'

import IJobRepository from '../repositories/IJobRepository'
import { ListJobsFiltersDTO } from '../dtos'
import { CollectionResponse, Job } from '../entities'
import validateClassParameters from '../../../utils/validateClassParameters'
import collectionResultPagination from '../../../utils/collectionResultPagination'

@injectable()
export default class ListJobsUseCase {
  constructor (
    @inject('JobRepository')
    private readonly jobRepository: IJobRepository
  ) {}

  public async execute (filtersDto: ListJobsFiltersDTO): Promise<CollectionResponse<Job>> {
    await validateClassParameters(filtersDto)

    const filters = this.setupFilters(filtersDto)

    const result = await this.jobRepository.findAll(filters)

    const baseUrl = `/api/jobs?what=${filters.what}&description=${filters.where}&jobType=${filters.jobType}&sortBy=${filters.sortBy}&sortOrder=${filters.sortOrder}`

    const [previous, next] = collectionResultPagination(result.count, filters.page, filters.limit, baseUrl)

    result.previous = previous
    result.next = next

    return result
  }

  private setupFilters (filters: ListJobsFiltersDTO): ListJobsFiltersDTO {
    filters.page = (filters.page < 1) ? 1 : filters.page

    filters.limit = (filters.limit < 1) ? 1 : filters.limit
    filters.limit = (filters.limit > 20) ? 20 : filters.limit

    const sortOptions = ['salary', 'createdAt']
    const sortBy = (!sortOptions.includes(filters.sortBy)) ? 'createdAt' : filters.sortBy

    const sortOrderOptions = ['asc', 'desc']
    const sortOrder = (!sortOrderOptions.includes(filters.sortOrder)) ? 'desc' : filters.sortOrder

    return {
      ...filters,
      sortBy,
      sortOrder
    }
  }
}
