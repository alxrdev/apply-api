import { IsString, IsEmail, IsDefined } from 'class-validator'
import { Expose } from 'class-transformer'

export default class AuthDTO {
  @IsDefined()
  @IsEmail()
  @Expose()
  email!: string

  @IsDefined()
  @IsString()
  @Expose()
  password!: string
}
