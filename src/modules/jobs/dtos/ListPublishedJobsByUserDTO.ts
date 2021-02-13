import { IsDefined, IsNotEmpty, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export default class ListPublishedJobsByUserDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  id!: string
}
