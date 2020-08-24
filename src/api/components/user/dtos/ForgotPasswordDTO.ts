import { IsDefined, IsEmail } from 'class-validator'
import { Expose } from 'class-transformer'

export default class ForgotPasswordDTO {
  @IsDefined()
  @IsEmail()
  @Expose()
  email: string
}
