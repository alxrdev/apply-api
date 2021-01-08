import { IsString, IsDefined, Length, MinLength, IsIn, IsNumber } from 'class-validator'
import { Expose, Transform } from 'class-transformer'
import { stringify } from 'querystring'

export default class CreateJobDTO {
  @IsDefined()
  @IsString()
  @Expose()
  userId!: string

  @IsDefined()
  @IsString()
  @Length(1, 100)
  @Expose()
  title!: string

  @IsDefined()
  @IsString()
  @Length(1, 5000)
  @Expose()
  description!: string

  @IsDefined()
  @IsString()
  @MinLength(1)
  @Expose()
  state!: string

  @IsDefined()
  @IsString()
  @MinLength(1)
  @Expose()
  city!: string

  @IsDefined()
  @IsString()
  @IsIn(['Full-time', 'Part-time', 'Permanent', 'Temporary', 'Contract', 'Internship'])
  @Expose()
  jobType!: string

  @IsDefined()
  @IsNumber()
  @Expose()
  @Transform(value => (!value || value < 100) ? 100 : value)
  salary!: number
}
