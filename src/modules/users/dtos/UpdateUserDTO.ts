import { Expose } from 'class-transformer'
import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator'

export default class UpdateUserDTO {
  @IsDefined()
  @IsString()
  @Expose()
  id: string

  @IsDefined()
  @IsString()
  @Expose()
  authUserId: string

  @IsDefined()
  @IsString()
  @MinLength(1)
  @Expose()
  name: string

  @IsDefined()
  @IsString()
  @MaxLength(30)
  @Expose()
  headline: string

  @IsDefined()
  @IsString()
  @MaxLength(30)
  @Expose()
  address: string

  @IsDefined()
  @IsString()
  @MaxLength(80)
  @Expose()
  bio: string
}
