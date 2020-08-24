import { IMailContact } from './IMailContact'

export default interface ISendMailDTO {
  to: IMailContact
  from?: IMailContact
  subject: string
  text: string
}
