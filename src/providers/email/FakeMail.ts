import { injectable } from 'tsyringe'
import IMailProvider from './interfaces/IMailProvider'

@injectable()
export default class FakeMail implements IMailProvider {
  public async sendMail (): Promise<void> {
    //
  }
}
