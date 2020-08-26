import path from 'path'
import dotenv from 'dotenv'
import crypto from 'crypto'
import IStorageSettings from '../services/storage/interfaces/IStorageSettings'
import { diskStorage as multerDiskStorage } from 'multer'

dotenv.config()

export const storageType = process.env.STORAGE_TYPE || 'disk'
export const storageTempFileDestination = process.env.STORAGE_TEMP_FILE_DESTINATION || path.resolve(__dirname, '..', '..', 'storage', 'tmp', 'uploads')
export const storageFileDestination = process.env.STORAGE_FILE_DESTINATION || path.resolve(__dirname, '..', '..', 'storage', 'uploads')
export const storageFileExtensionTypes = process.env.STORAGE_FILE_EXTENSION_TYPES || '.doc,.pdf'
export const storageFileMIMETypes = process.env.STORAGE_FILE_MIME_TYPES || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf'
export const storageFileMaxSize = (process.env.STORAGE_FILE_MAX_SIZE) ? Number(process.env.STORAGE_MAX_SIZE) : 2000000

export const diskStorage: IStorageSettings = {
  storageType,
  storageTempFileDestination,
  storageFileDestination,
  storageFileExtensionTypes,
  storageFileMIMETypes,
  storageFileMaxSize,
  storageEngine: multerDiskStorage({
    destination: function (req, file, cb) {
      cb(null, storageTempFileDestination)
    },
    filename: function (req, file, cb) {
      const fileHash = crypto.randomBytes(10).toString('hex')
      const fileName = `${fileHash}-${Date.now()}${path.extname(file.originalname)}`
      cb(null, fileName)
    }
  })
}
