import { IsDefined, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export default class ListPublishedJobsByUserDTO {
  @IsDefined()
  @IsString()
  @Expose()
  id: string
}
