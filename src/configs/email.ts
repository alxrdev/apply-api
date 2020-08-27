import dotenv from 'dotenv'

dotenv.config()

const smtpEnv = (process.env.SMTP_PROFILE) ? JSON.parse(process.env.SMTP_PROFILE) : JSON.parse('')

export interface MailProfile {
  provider: string
  senderName: string
  senderEmail: string
  host: string
  port: number
  username: string
  password: string
}

export const smtpProfile: MailProfile = smtpEnv as MailProfile
