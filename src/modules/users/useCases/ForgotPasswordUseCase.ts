import { injectable, inject } from 'tsyringe'
import crypto from 'crypto'
import dotenv from 'dotenv'

import IUserRepository from '../repositories/IUserRepository'
import IMailService from '../../../services/email/interfaces/IMailService'
import { ForgotPasswordDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'

dotenv.config()

@injectable()
export default class ForgotPasswordUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('MailService')
    private readonly mailService: IMailService
  ) {}

  public async execute (forgotPasswordDto: ForgotPasswordDTO): Promise<void> {
    await validateClassParameters(forgotPasswordDto)

    const user = await this.userRepository.findByEmail(forgotPasswordDto.email)

    const [resetToken, hashToken] = this.generateResetPasswordToken()

    const expirationTime = new Date(Date.now() + 30 * 60 * 1000)

    user.resetPasswordToken = hashToken
    user.resetPasswordExpire = expirationTime

    await this.userRepository.update(user)

    await this.mailService.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: 'Jobbee Password Recovery',
      text: `Hello ${user.name}, here is the link to reset your account password: ${process.env.HOST}/api/password/reset/${resetToken}`
    })
  }

  private generateResetPasswordToken (): Array<string> {
    const resetToken = crypto.randomBytes(20).toString('hex')

    const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    return [resetToken, hashToken]
  }
}
