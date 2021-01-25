import { Expose } from 'class-transformer'
import { IsDefined, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export default class UpdateUserDTO {
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
  @MinLength(1)
  @Expose()
  name!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Expose()
  headline!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Expose()
  address!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Expose()
  bio!: string
}
