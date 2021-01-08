import { IsString, IsDefined } from 'class-validator'
import { Expose } from 'class-transformer'

export default class DeleteUserDTO {
  @IsDefined()
  @IsString()
  @Expose()
  id!: string

  @IsDefined()
  @IsString()
  @Expose()
  authUserId!: string
}
