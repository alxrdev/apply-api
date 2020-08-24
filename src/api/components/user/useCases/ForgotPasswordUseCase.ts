import IUserRepository from '../repositories/IUserRepository'
import IMailProvider from '../../../../services/email/interfaces/IMailProvider'
import ForgotPasswordDTO from '../dtos/ForgotPasswordDTO'
import validateClassParameters from '../../../../utils/validateClassParameters'
import crypto from 'crypto'

export default class ForgotPasswordUseCase {
  constructor (
    private readonly userRepository: IUserRepository,
    private readonly mailProvider: IMailProvider
  ) {}

  public async forgotPassword (forgotPasswordDto: ForgotPasswordDTO): Promise<void> {
    await validateClassParameters(forgotPasswordDto)

    const user = await this.userRepository.findByEmail(forgotPasswordDto.email)

    const [resetToken, hashToken] = this.generateResetPasswordToken()

    const expirationTime = new Date(Date.now() + 30 * 60 * 1000)

    user.resetPasswordToken = hashToken
    user.resetPasswordExpire = expirationTime

    await this.userRepository.update(user)

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: 'Jobbee Password Recovery',
      text: `Hello ${user.name}, here is the link to reset your account password: http://localhost:3000/api/password/reset/${resetToken}`
    })
  }

  private generateResetPasswordToken (): Array<string> {
    const resetToken = crypto.randomBytes(20).toString('hex')

    const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    return [resetToken, hashToken]
  }
}
