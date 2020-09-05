import { Expose, Transform } from 'class-transformer'
import { IsString, IsNumber } from 'class-validator'

export default class ListJobsFiltersDTO {
  @IsString()
  @Expose()
  @Transform(value => value || '')
  what: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  where: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  jobType: string

  @IsNumber()
  @Expose()
  @Transform(value => Number(value) || 1)
  page: number

  @IsNumber()
  @Expose()
  @Transform(value => Number(value) || 10)
  limit: number

  @IsString()
  @Expose()
  @Transform(value => value || 'createdAt')
  sortBy: string

  @IsString()
  @Expose()
  @Transform(value => value || 'asc')
  sortOrder: string
}
