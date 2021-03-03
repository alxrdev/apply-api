import { injectable } from 'tsyringe'

import IStorageService from './interfaces/IStorageService'

@injectable()
export default class FakeStorageService implements IStorageService {
  public async save (): Promise<void> {
    //
  }

  public async delete (): Promise<void> {
    //
  }
}
