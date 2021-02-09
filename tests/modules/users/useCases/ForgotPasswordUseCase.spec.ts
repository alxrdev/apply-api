import { ForgotPasswordDTO } from "@modules/users/dtos"
import { User } from "@modules/users/entities"
import { UserNotFoundError } from "@modules/users/errors"
import FakeUserRepository from "@modules/users/repositories/fake/FakeUserRepository"
import IUserRepository from "@modules/users/repositories/IUserRepository"
import { ForgotPasswordUseCase } from "@modules/users/useCases"
import Mailtrap from "@services/email/Mailtrap"

const makeDto = (fields = {}) : ForgotPasswordDTO => {
  const data = { email: 'user@email.com', ...fields }
  const dto = new ForgotPasswordDTO()
  dto.email = data.email
  return dto
}

const mockSendMail = jest.fn()

jest.mock('@services/email/MailTrap', () => {
	return jest.fn().mockImplementation(() => {
		return { sendMail: mockSendMail }
	})
})

let userRepository: IUserRepository

const makeSut = () : ForgotPasswordUseCase => new ForgotPasswordUseCase(userRepository, new Mailtrap({ username: '', password: '', host: '', port: 0, senderEmail: '', senderName: ''}))

describe('Test the ForgotPasswordUseCase class', () => {
  beforeEach(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

    mockSendMail.mock.calls = []
  })

  it('Should throw a UserNotFoundError when the email provided does not exists', async () => {
    const forgotPasswordUseCase = makeSut()
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')
    const dto = makeDto({ email: 'invalid@email.com' })

    await expect(forgotPasswordUseCase.execute(dto)).rejects.toThrowError(UserNotFoundError)
    expect(spyFindByEmail).toHaveBeenCalled()
  })

  it('Should create the reset password token, the reset password expire time and return the reset token', async () => {
    const forgotPasswordUseCase = makeSut()
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const dto = makeDto()

    const resetToken = await forgotPasswordUseCase.execute(dto)

    expect(resetToken.length).toBeGreaterThan(0)
    expect(spyFindByEmail).toHaveBeenCalled()
    expect(spyUpdate).toHaveBeenCalled()

    const user = await userRepository.findById('1')

    expect(user.resetPasswordToken).toBeDefined()
    expect(user.resetPasswordExpire).toBeDefined()
  })

  it('Should send the reset password token to the user email', async () => {
    const forgotPasswordUseCase = makeSut()
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const dto = makeDto()

    await forgotPasswordUseCase.execute(dto)
    
    expect(spyFindByEmail).toHaveBeenCalled()
    expect(spyUpdate).toHaveBeenCalled()
    expect(mockSendMail.mock.calls.length).toBe(1)
  })
})