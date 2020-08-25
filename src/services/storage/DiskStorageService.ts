import IStorageService from './interfaces/IStorageService'
import { IStorageSettings } from '../../configs/storage'
import fs from 'fs'
import path from 'path'
import AppError from '../../errors/AppError'

export default class DiskStorageService implements IStorageService {
  constructor (
    private readonly diskStorageSettings: Pick<IStorageSettings, 'storageTempFileDestination' | 'storageFileDestination'>
  ) {}

  public async save (fileName: string, newName?: string): Promise<void> {
    const name = (newName) ? `${newName}${path.extname(fileName)}` : fileName

    const oldPath = path.resolve(this.diskStorageSettings.storageTempFileDestination, fileName)
    const newPath = path.resolve(this.diskStorageSettings.storageFileDestination, name)

    try {
      await fs.promises.rename(oldPath, newPath)
    } catch (error) {
      throw new AppError(error.message)
    }
  }

  public async delete (fileName: string): Promise<void> {
    const oldPath = path.resolve(this.diskStorageSettings.storageTempFileDestination, fileName)

    try {
      await fs.promises.unlink(oldPath)
    } catch (error) {
      throw new AppError(error.message)
    }
  }
}
