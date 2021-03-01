import IStorageService from './interfaces/IStorageService'

export default class FakeStorageService implements IStorageService {
  public async save (): Promise<void> {
    //
  }

  public async delete (): Promise<void> {
    //
  }
}
