import { IsDefined, IsString, Length, MinLength, IsIn, IsNumber } from 'class-validator'
import { Expose, Transform } from 'class-transformer'

export default class UpdateJobDTO {
  @IsDefined()
  @IsString()
  @Expose()
  id: string

  @IsDefined()
  @IsString()
  @Expose()
  authId: string

  @IsDefined()
  @IsString()
  @Length(1, 100)
  @Expose()
  title: string

  @IsDefined()
  @IsString()
  @Length(1, 1000)
  @Expose()
  description: string

  @IsDefined()
  @IsString()
  @Length(3)
  @Expose()
  country: string

  @IsDefined()
  @IsString()
  @MinLength(1)
  @Expose()
  city: string

  @IsDefined()
  @IsString()
  @IsIn(['Permanent', 'Temporary', 'Internship', 'Freelancer'])
  @Expose()
  jobType: string

  @IsDefined()
  @IsString()
  @IsIn(['Full Time', 'Part Time'])
  @Expose()
  workTime: string

  @IsDefined()
  @IsString()
  @IsIn(['This country', 'Remote', 'Worldwide'])
  @Expose()
  workplace: string

  @IsString()
  @Expose()
  @Transform(value => value || '')
  tags: string

  @IsDefined()
  @IsNumber()
  @Expose()
  @Transform(value => (!value || value < 100) ? 100 : value)
  salary: number
}
