import IMailService from "./interfaces/IMailService";
import SendMailDTO from "./interfaces/SendMailDTO";

export default class FakeMail implements IMailService {
  public async sendMail(data: SendMailDTO): Promise<void> {
    // 
  }
}