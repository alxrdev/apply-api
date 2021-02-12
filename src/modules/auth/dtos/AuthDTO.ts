import { IsString, IsEmail, IsDefined, IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'

export default class AuthDTO {
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  password!: string
}
