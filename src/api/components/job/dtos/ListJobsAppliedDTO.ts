import { IsDefined, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export default class ListJobsAppliedDTO {
  @IsDefined()
  @IsString()
  @Expose()
  authId: string

  @IsDefined()
  @IsString()
  @Expose()
  userId: string
}
