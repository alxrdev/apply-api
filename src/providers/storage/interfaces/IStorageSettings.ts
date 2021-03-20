import { StorageEngine } from 'multer'

export default interface IStorageSettings {
  storageTempFileDestination: string
  storageFileDestination: string
  storageFileExtensionTypes: string
  storageFileMIMETypes: string
  storageFileMaxSize: number
  storageRequest?: string
  storageEngine: StorageEngine
}
