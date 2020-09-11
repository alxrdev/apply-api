import { Expose } from 'class-transformer'
import { IsDefined, IsString } from 'class-validator'

export default class ListUsersAppliedDTO {
  @IsDefined()
  @IsString()
  @Expose()
  id: string

  @IsDefined()
  @IsString()
  @Expose()
  authUserId: string
}
