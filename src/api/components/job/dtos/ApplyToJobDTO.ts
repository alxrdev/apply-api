import { IsDefined, IsString } from 'class-validator'
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

  resume: string
}
