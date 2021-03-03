import { injectable } from 'tsyringe'
import IMailService from './interfaces/IMailService'

@injectable()
export default class FakeMail implements IMailService {
  public async sendMail (): Promise<void> {
    //
  }
}
