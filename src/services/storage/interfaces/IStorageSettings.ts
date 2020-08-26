import { StorageEngine } from 'multer'

export default interface IStorageSettings {
  storageType: string
  storageTempFileDestination: string
  storageFileDestination: string
  storageFileExtensionTypes: string
  storageFileMIMETypes: string
  storageFileMaxSize: number
  storageEngine: StorageEngine
}
