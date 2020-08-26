import { Expose, Transform } from 'class-transformer'
import { IsString, IsNumber } from 'class-validator'

export default class ListJobsFiltersDTO {
  @IsString()
  @Expose()
  @Transform(value => value || '')
  title: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  description: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  company: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  industry: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  jobType: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  minEducation: string

  industryRegex: Array<RegExp>

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
  @Transform(value => value || 'postingDate')
  sortBy: string

  @IsString()
  @Expose()
  @Transform(value => value || 'asc')
  sortOrder: string
}
