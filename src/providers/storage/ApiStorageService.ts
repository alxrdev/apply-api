import { injectable } from 'tsyringe'
import axios from 'axios'
import IStorageService from './interfaces/IStorageService'
import IStorageSettings from './interfaces/IStorageSettings'
import path from 'path'
import AppError from '../../errors/AppError'

@injectable()
export default class ApiStorageService implements IStorageService {
  constructor (
    private readonly storageSettings: Pick<IStorageSettings, 'storageTempFileDestination' | 'storageFileDestination' | 'storageRequest'>
  ) {}

  public async save (fileName: string, newName?: string): Promise<void> {
    const name = (newName) ? `${newName}${path.extname(fileName)}` : fileName

    try {
      await axios.put(this.storageSettings.storageRequest || '', {
        action: this.storageSettings.storageFileDestination,
        newName: name,
        oldName: fileName
      })
    } catch (err) {
      throw new AppError(err.message)
    }
  }

  public async delete (fileName: string, isTemp: boolean): Promise<void> {
    const action = (isTemp) ? this.storageSettings.storageTempFileDestination : this.storageSettings.storageFileDestination

    try {
      await axios.delete(`${this.storageSettings.storageRequest}?action=${action}&name=${fileName}`)
    } catch (err) {
      throw new AppError(err.message)
    }
  }
}
