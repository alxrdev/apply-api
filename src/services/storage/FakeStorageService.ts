import IStorageService from './interfaces/IStorageService'

export default class FakeStorageService implements IStorageService {
  public async save(fileName: string, newName?: string): Promise<void> {
    //
  }

  public async delete(fileName: string, isTemp: boolean): Promise<void> {
    //
  }  
}