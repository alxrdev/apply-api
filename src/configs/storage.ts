import path from 'path'
import dotenv from 'dotenv'
import crypto from 'crypto'
import IStorageSettings from '../services/storage/interfaces/IStorageSettings'
import { diskStorage as multerDiskStorage } from 'multer'

dotenv.config()

const storageType = process.env.STORAGE_TYPE || 'disk'
const storageProfiles = (process.env.STORAGE_PROFILES) ? JSON.parse(process.env.STORAGE_PROFILES) : JSON.parse('')

interface StorageProfile {
  tmpDestination: string
  destination: string
  extensionTypes: string
  mimeTypes: string
  maxSize: number
}

const avatarProfile: StorageProfile = storageProfiles.avatar as StorageProfile
const resumeProfile: StorageProfile = storageProfiles.resume as StorageProfile

const diskStorage = (tmpDestination: string) => multerDiskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDestination)
  },
  filename: function (req, file, cb) {
    const fileHash = crypto.randomBytes(10).toString('hex')
    const fileName = `${fileHash}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, fileName)
  }
})

const avatarDiskStorage: IStorageSettings = {
  storageType,
  storageTempFileDestination: avatarProfile.tmpDestination,
  storageFileDestination: avatarProfile.destination,
  storageFileExtensionTypes: avatarProfile.extensionTypes,
  storageFileMIMETypes: avatarProfile.mimeTypes,
  storageFileMaxSize: avatarProfile.maxSize,
  storageEngine: diskStorage(avatarProfile.tmpDestination)
}

const resumeDiskStorage: IStorageSettings = {
  storageType,
  storageTempFileDestination: resumeProfile.tmpDestination,
  storageFileDestination: resumeProfile.destination,
  storageFileExtensionTypes: resumeProfile.extensionTypes,
  storageFileMIMETypes: resumeProfile.mimeTypes,
  storageFileMaxSize: resumeProfile.maxSize,
  storageEngine: diskStorage(resumeProfile.tmpDestination)
}

const exportStorage = () => {
  const resumeStorageSettings = resumeDiskStorage
  const avatarStorageSettings = avatarDiskStorage
  return [resumeStorageSettings, avatarStorageSettings]
}

const [resumeStorageSettings, avatarStorageSettings] = exportStorage()

export { resumeStorageSettings, avatarStorageSettings }
