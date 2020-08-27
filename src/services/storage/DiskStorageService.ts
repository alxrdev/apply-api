import { injectable } from 'tsyringe'
import IStorageService from './interfaces/IStorageService'
import IStorageSettings from './interfaces/IStorageSettings'
import fs from 'fs'
import path from 'path'
import AppError from '../../errors/AppError'

@injectable()
export default class DiskStorageService implements IStorageService {
  constructor (
    private readonly storageSettings: Pick<IStorageSettings, 'storageTempFileDestination' | 'storageFileDestination'>
  ) {}

  public async save (fileName: string, newName?: string): Promise<void> {
    const name = (newName) ? `${newName}${path.extname(fileName)}` : fileName

    const oldPath = path.resolve(this.storageSettings.storageTempFileDestination, fileName)
    const newPath = path.resolve(this.storageSettings.storageFileDestination, name)

    try {
      await fs.promises.rename(oldPath, newPath)
    } catch (error) {
      throw new AppError(error.message)
    }
  }

  public async delete (fileName: string, isTemp: boolean): Promise<void> {
    const currentPath = (isTemp) ? this.storageSettings.storageTempFileDestination : this.storageSettings.storageFileDestination
    const pathToRemove = path.resolve(currentPath, fileName)

    try {
      await fs.promises.unlink(pathToRemove)
    } catch (error) {
      throw new AppError(error.message)
    }
  }
}
