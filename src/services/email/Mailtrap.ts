import { injectable, inject } from 'tsyringe'
import dotenv from 'dotenv'
import nodemailer, { Transporter } from 'nodemailer'

import IMailService from './interfaces/IMailService'
import IMailSettings from './interfaces/IMailSettings'
import SendMailDTO from './interfaces/SendMailDTO'
import AppError from '../../errors/AppError'

dotenv.config()

@injectable()
export default class Mailtrap implements IMailService {
  private transporter: Transporter
  private senderName: string
  private senderEmail: string

  constructor (
    @inject('MailSettings')
      mailSettings: IMailSettings
  ) {
    if (!mailSettings.host || !mailSettings.port || !mailSettings.username || !mailSettings.password) {
      throw new AppError('Email service env variables not loaded.')
    }

    this.senderEmail = mailSettings.senderEmail
    this.senderName = mailSettings.senderName

    this.transporter = nodemailer.createTransport({
      host: mailSettings.host,
      port: mailSettings.port,
      auth: {
        user: mailSettings.username,
        pass: mailSettings.password
      }
    })
  }

  public async sendMail (data: SendMailDTO): Promise<void> {
    data.from = data.from ?? {
      name: this.senderName,
      email: this.senderEmail
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
