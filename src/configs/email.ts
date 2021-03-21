import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const smtpEnv = (process.env.SMTP_PROFILE)
  ? JSON.parse(process.env.SMTP_PROFILE)
  : { provider: '', senderName: '', senderEmail: '', host: '', port: 0, username: '', password: '' }

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
