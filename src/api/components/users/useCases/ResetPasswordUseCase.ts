import IUserRepository from '../repositories/IUserRepository'
import ResetPasswordDTO from '../dtos/ResetPasswordDTO'
import validateClassParameters from '../../../../utils/validateClassParameters'
import validatePasswordAndConfirmPassword from '../utils/validatePasswordAndConfirmPassword'
import AppError from '../../../../errors/AppError'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export default class ResetPasswordUseCase {
  constructor (
    private readonly userRepository: IUserRepository
  ) {}

  public async resetPassword (resetPasswordDto: ResetPasswordDTO): Promise<void> {
    await validateClassParameters(resetPasswordDto)

    validatePasswordAndConfirmPassword(resetPasswordDto.password, resetPasswordDto.confirmPassword)

    const resetPasswordToken = crypto.createHash('sha256').update(resetPasswordDto.token).digest('hex')

    const user = await this.userRepository.findByResetPasswordToken(resetPasswordToken)

    if (user.resetPasswordExpire && user.resetPasswordExpire < new Date()) {
      throw new AppError('Password reset token is invalid.', false, 400)
    }

    user.password = bcrypt.hashSync(resetPasswordDto.password, 10)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await this.userRepository.update(user)
  }
}
