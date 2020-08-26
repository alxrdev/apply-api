import { IsDefined, IsString, Length, IsEmail, MinLength, IsIn, IsNumber } from 'class-validator'
import { Expose } from 'class-transformer'

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
  @IsEmail()
  @Expose()
  email: string

  @IsDefined()
  @IsString()
  @MinLength(1)
  @Expose()
  address: string

  @IsDefined()
  @IsString()
  @MinLength(1)
  @Expose()
  company: string

  @IsDefined()
  @IsString()
  @Expose()
  industry: string

  @IsDefined()
  @IsString()
  @IsIn(['Permanent', 'Temporary', 'Internship'])
  @Expose()
  jobType: string

  @IsDefined()
  @IsString()
  @IsIn(['Bachelors', 'Masters', 'Phd'])
  @Expose()
  minEducation: string

  @IsDefined()
  @IsString()
  @IsIn(['No Experience', '1 Year - 2 Years', '2 Years - 5 Years', '5 Years+'])
  @Expose()
  experience: string

  @IsDefined()
  @IsNumber()
  @Expose()
  salary: number

  @IsDefined()
  @IsNumber()
  @Expose()
  position: number
}
