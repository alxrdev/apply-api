import { injectable, inject } from 'tsyringe'
import crypto from 'crypto'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import IMailProvider from '@src/providers/email/interfaces/IMailProvider'
import { ForgotPasswordDTO } from '@modules/users/dtos'
import validateClassParameters from '@utils/validateClassParameters'

@injectable()
export default class ForgotPasswordUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('MailProvider')
    private readonly mailProvider: IMailProvider
  ) {}

  public async execute (forgotPasswordDto: ForgotPasswordDTO): Promise<string> {
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
      text: `Hello ${user.name}, here is the token to reset your account password: ${resetToken}`
    })

    return resetToken
  }

  private generateResetPasswordToken (): Array<string> {
    const resetToken = crypto.randomBytes(20).toString('hex')

    const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    return [resetToken, hashToken]
  }
}
