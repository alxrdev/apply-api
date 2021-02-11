import { IsDefined, IsNotEmpty, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export default class ListJobsAppliedDTO {
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
}
