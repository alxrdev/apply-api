import { IsDefined, IsString, Length, MinLength, IsIn, IsNumber, IsNotEmpty } from 'class-validator'
import { Expose, Transform } from 'class-transformer'

export default class UpdateJobDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  id!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  authId!: string

  @IsDefined()
  @IsString()
  @Length(1, 100)
  @Expose()
  title!: string

  @IsDefined()
  @IsString()
  @Length(1, 1000)
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
