import IMailSettings from './interfaces/IMailSettings'
import { smtpProfile } from '../../configs/email'
import Mailtrap from './Mailtrap'

const mailServiceSettings: IMailSettings = {
  senderName: smtpProfile.senderName,
  senderEmail: smtpProfile.senderEmail,
  host: smtpProfile.host,
  port: smtpProfile.port,
  username: smtpProfile.username,
  password: smtpProfile.password
}

// const mailService = (smtpProfile.provider === 'mailtrap') ? new Mailtrap(mailServiceSettings) :

export const mailService = new Mailtrap(mailServiceSettings)
