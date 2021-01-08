import { IsDefined, IsEmail, IsIn, MinLength, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export default class CreateUserDTO {
  @IsDefined()
  @IsString()
  @Expose()
  public name!: string

  @IsDefined()
  @IsEmail()
  @Expose()
  public email!: string

  @IsDefined()
  @IsIn(['user', 'employer'])
  @Expose()
  public role!: string

  @IsDefined()
  @IsString()
  @MinLength(8)
  @Expose()
  public password!: string

  @IsDefined()
  @IsString()
  @MinLength(8)
  @Expose()
  public confirmPassword!: string
}
