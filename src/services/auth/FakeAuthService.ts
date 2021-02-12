import { User } from "@modules/users/entities";
import IAuthService from "./interfaces/IAuthService";

export default class FakeAuthService implements IAuthService {
  authenticateUser(user: User): string {
    return 'theGeneratedToken'
  }  
}