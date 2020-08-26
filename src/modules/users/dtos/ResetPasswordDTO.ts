import { IsDefined, IsString, MinLength } from 'class-validator'
import { Expose } from 'class-transformer'

export default class ResetPasswordDTO {
  @IsDefined()
  @IsString()
  @MinLength(8)
  @Expose()
  password: string

  @IsDefined()
  @IsString()
  @MinLength(8)
  @Expose()
  confirmPassword: string

  @IsDefined()
  @IsString()
  @Expose()
  token: string
}
