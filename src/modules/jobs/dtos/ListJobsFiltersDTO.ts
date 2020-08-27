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
  country: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  city: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  workTime: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  jobType: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  tags: string

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
