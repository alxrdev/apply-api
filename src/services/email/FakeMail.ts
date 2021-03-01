import IMailService from './interfaces/IMailService'

export default class FakeMail implements IMailService {
  public async sendMail (): Promise<void> {
    //
  }
}
