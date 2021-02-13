import { IsDefined, IsEmail, IsIn, MinLength, IsString, IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'

export default class CreateUserDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Expose()
  public name!: string

  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  public email!: string

  @IsDefined()
  @IsNotEmpty()
  @IsIn(['user', 'employer'])
  @Expose()
  public role!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Expose()
  public password!: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Expose()
  public confirmPassword!: string
}
