import { IsDefined, IsString, MinLength } from 'class-validator'
import { Expose } from 'class-transformer'

export default class ApplyToJobDTO {
  @IsDefined()
  @IsString()
  @Expose()
  id: string

  @IsDefined()
  @IsString()
  @Expose()
  userId: string

  @IsDefined()
  @IsString()
  @MinLength(5)
  @Expose()
  resume: string
}
