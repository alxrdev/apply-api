import path from 'path'
import crypto from 'crypto'
import { diskStorage as multerDiskStorage } from 'multer'

import IStorageSettings from './interfaces/IStorageSettings'
import DiskStorageService from './DiskStorageService'
import { avatarProfile, resumeProfile } from '../../configs/storage'

const diskStorageEngine = (tmpDestination: string) => multerDiskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDestination)
  },
  filename: function (req, file, cb) {
    const fileHash = crypto.randomBytes(10).toString('hex')
    const fileName = `${fileHash}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, fileName)
  }
})

const avatarDiskStorageSettings: IStorageSettings = {
  storageTempFileDestination: avatarProfile.tmpDestination,
  storageFileDestination: avatarProfile.destination,
  storageFileExtensionTypes: avatarProfile.extensionTypes,
  storageFileMIMETypes: avatarProfile.mimeTypes,
  storageFileMaxSize: avatarProfile.maxSize,
  storageEngine: diskStorageEngine(avatarProfile.tmpDestination)
}

const resumeDiskStorageSettings: IStorageSettings = {
  storageTempFileDestination: resumeProfile.tmpDestination,
  storageFileDestination: resumeProfile.destination,
  storageFileExtensionTypes: resumeProfile.extensionTypes,
  storageFileMIMETypes: resumeProfile.mimeTypes,
  storageFileMaxSize: resumeProfile.maxSize,
  storageEngine: diskStorageEngine(resumeProfile.tmpDestination)
}

const exportStorage = () => {
  const resumeStorageSettings = resumeDiskStorageSettings
  const avatarStorageSettings = avatarDiskStorageSettings
  return [resumeStorageSettings, avatarStorageSettings]
}

const exportStorageService = (resumeStorageSettings: IStorageSettings, avatarStorageSettings: IStorageSettings) => {
  // const resumeStorageService = (storageType === 'disk') ? new DiskStorageService(resumeStorageSettings) :
  // const avatarStorageService = (storageType === 'disk') ? new DiskStorageService(avatarStorageSettings) :
  const resumeStorageService = new DiskStorageService(resumeStorageSettings)
  const avatarStorageService = new DiskStorageService(avatarStorageSettings)
  return [resumeStorageService, avatarStorageService]
}

const [resumeStorageSettings, avatarStorageSettings] = exportStorage()
const [resumeStorageService, avatarStorageService] = exportStorageService(resumeStorageSettings, avatarStorageSettings)

export { resumeStorageSettings, avatarStorageSettings }
export { resumeStorageService, avatarStorageService }
