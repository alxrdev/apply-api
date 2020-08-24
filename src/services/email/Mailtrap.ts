import nodemailer, { Transporter } from 'nodemailer'
import IMailService from './interfaces/IMailService'
import SendMailDTO from './interfaces/SendMailDTO'
import AppError from '../../errors/AppError'
import dotenv from 'dotenv'

dotenv.config()

export default class Mailtrap implements IMailService {
  private transporter: Transporter

  constructor () {
    if (
      !process.env.SMTP_MAILTRAP_HOST ||
      !process.env.SMTP_MAILTRAP_PORT ||
      !process.env.SMTP_MAILTRAP_USERNAME ||
      !process.env.SMTP_MAILTRAP_PASSWORD
    ) {
      throw new AppError('Email service env variables not loaded.')
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_MAILTRAP_HOST,
      port: Number(process.env.SMTP_MAILTRAP_PORT),
      auth: {
        user: process.env.SMTP_MAILTRAP_USERNAME,
        pass: process.env.SMTP_MAILTRAP_PASSWORD
      }
    })
  }

  public async sendMail (data: SendMailDTO): Promise<void> {
    data.from = data.from ?? {
      name: process.env.SMTP_FROM_NAME || '',
      email: process.env.SMTP_FROM_EMAIl || ''
    }

    const message = {
      from: {
        name: data.from.name,
        address: data.from.email
      },
      to: {
        name: data.to.name,
        address: data.to.email
      },
      subject: data.subject,
      text: data.text
    }

    try {
      await this.transporter.sendMail(message)
    } catch (error) {
      throw new AppError(error.message)
    }
  }
}
