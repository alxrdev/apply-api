import SendMailDTO from './SendMailDTO'

export default interface IMailService {
  sendMail (data: SendMailDTO): Promise<void>
}
