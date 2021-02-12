import { Expose } from 'class-transformer'
import { IsDefined, IsNotEmpty, IsString } from 'class-validator'

export default class ShowUserAppliedDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  id!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  authUserId!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  userId!: string
}
