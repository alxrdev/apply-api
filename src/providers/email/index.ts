import IMailSettings from './interfaces/IMailSettings'
import { smtpProfile } from '@configs/email'
import Mailtrap from './Mailtrap'

const mailProviderSettings: IMailSettings = {
  senderName: smtpProfile.senderName,
  senderEmail: smtpProfile.senderEmail,
  host: smtpProfile.host,
  port: smtpProfile.port,
  username: smtpProfile.username,
  password: smtpProfile.password
}

// const mailService = (smtpProfile.provider === 'mailtrap') ? new Mailtrap(mailProviderSettings) :

export const mailProvider = new Mailtrap(mailProviderSettings)
