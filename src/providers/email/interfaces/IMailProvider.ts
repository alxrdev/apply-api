import SendMailDTO from './SendMailDTO'

export default interface IMailProvider {
  sendMail (data: SendMailDTO): Promise<void>
}
