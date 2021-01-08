import { IsString, IsDefined, IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'

export default class UpdateUserAvatarDTO {
  @IsDefined()
  @IsString()
  @Expose()
  id!: string

  @IsDefined()
  @IsString()
  @Expose()
  authId!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  avatar!: string
}
