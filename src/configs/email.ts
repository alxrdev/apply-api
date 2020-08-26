import dotenv from 'dotenv'
import IMailSettings from '../services/email/interfaces/IMailSettings'

dotenv.config()

const host = process.env.SMTP_HOST || ''
const port = (process.env.SMTP_PORT) ? Number(process.env.SMTP_PORT) : 0
const username = process.env.SMTP_USERNAME || ''
const password = process.env.SMTP_PASSWORD || ''
const senderName = process.env.SMTP_FROM_NAME || ''
const senderEmail = process.env.SMTP_FROM_EMAIl || ''

export const mailSettings: IMailSettings = {
  host,
  port,
  username,
  password,
  senderName,
  senderEmail
}
