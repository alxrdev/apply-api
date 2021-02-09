import { AppError, InvalidArgumentError } from "@errors/index"
import { ResetPasswordDTO } from "@modules/users/dtos"
import { User } from "@modules/users/entities"
import FakeUserRepository from "@modules/users/repositories/fake/FakeUserRepository"
import IUserRepository from "@modules/users/repositories/IUserRepository"
import { ForgotPasswordUseCase, ResetPasswordUseCase } from "@modules/users/useCases"
import FakeMail from "@services/email/FakeMail"

const makeDto = (fields = {}): ResetPasswordDTO => {
  const data = { password: '12345678', confirmPassword: '12345678', token: '', ...fields }
  const dto = new ResetPasswordDTO()
  dto.password = data.password
  dto.confirmPassword = data.confirmPassword
  dto.token = data.token
  return dto
}

let userRepository: IUserRepository

const makeSut = (): ResetPasswordUseCase => new ResetPasswordUseCase(userRepository)

const makeForgotPassword = async (email: string, timeIsInvalid: boolean = false): Promise<string | undefined> => {
  jest.spyOn(Date, 'now').mockImplementationOnce(() => {
    return (timeIsInvalid) ? new Date(Date.now() - 40 * 60 * 1000).getTime() : new Date(Date.now() + 30 * 60 * 1000).getTime();
  })
  
  const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, new FakeMail())
  return await forgotPasswordUseCase.execute({ email })
}

describe('Tests the ResetPasswordUseCase class', () => {
  beforeEach(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const resetPasswordUseCase = makeSut()
    const dto = makeDto({ password: '' })

    await expect(resetPasswordUseCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw an InvalidArgumentError when the password and confirm password does not match', async () => {
    const resetPasswordUseCase = makeSut()
    const dto = makeDto({ password: '12345678', confirmPassword: '123456789' })

    await expect(resetPasswordUseCase.execute(dto)).rejects.toThrowError(InvalidArgumentError)
  })

  it('Should throw an AppError when the token provided is invalid', async () => {
    const resetPasswordUseCase = makeSut()
    const spyFindByResetPasswordToken = jest.spyOn(userRepository, 'findByResetPasswordToken')
    const dto = makeDto({ token: '1234invalid' })

    await expect(resetPasswordUseCase.execute(dto)).rejects.toThrowError(AppError)
    expect(spyFindByResetPasswordToken).toHaveBeenCalled()
  })

  it('Should throw an AppError when the time to reset the password has expired', async () => {
    const token = await makeForgotPassword('user@email.com', true)

    const resetPasswordUseCase = makeSut()
    const spyFindByResetPasswordToken = jest.spyOn(userRepository, 'findByResetPasswordToken')
    const dto = makeDto({ token })

    await expect(resetPasswordUseCase.execute(dto)).rejects.toThrowError(AppError)
    expect(spyFindByResetPasswordToken).toHaveBeenCalled()
  })

  it('Should update the user password, remove the resetPasswordToken and resetPasswordExpires', async () => {
    const token = await makeForgotPassword('user@email.com')
    
    const resetPasswordUseCase = makeSut()
    const spyFindByResetPasswordToken = jest.spyOn(userRepository, 'findByResetPasswordToken')
    const spyUpdate = jest.spyOn(userRepository, 'update')

    const dto = makeDto({ token })

    await resetPasswordUseCase.execute(dto)

    const user = await userRepository.findById('1')

    expect(user.password).not.toEqual('password')
    expect(user.resetPasswordToken).toBeUndefined()
    expect(user.resetPasswordExpire).toBeUndefined()
    expect(spyFindByResetPasswordToken).toHaveBeenCalled()
    expect(spyUpdate).toHaveBeenCalled()
  })
})