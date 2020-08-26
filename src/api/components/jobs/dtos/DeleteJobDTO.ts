import { IsDefined, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export default class DeleteJobDTO {
  @IsDefined()
  @IsString()
  @Expose()
  id: string

  @IsDefined()
  @IsString()
  @Expose()
  authId: string
}
