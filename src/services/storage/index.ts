import path from 'path'
import crypto from 'crypto'
import { diskStorage as multerDiskStorage } from 'multer'
import multerApiStorage from './multerApiStorage'

import IStorageSettings from './interfaces/IStorageSettings'
import DiskStorageService from './DiskStorageService'
import ApiStorageService from './ApiStorageService'
import { avatarProfile, resumeProfile, storageType } from '../../configs/storage'

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

const apiStorageEngine = (request?: string) => multerApiStorage({
  filename: function (file: any) {
    const fileHash = crypto.randomBytes(10).toString('hex')
    return `${fileHash}-${Date.now()}${path.extname(file.originalname)}`
  },
  url: request || ''
})

const avatarDiskStorageSettings: IStorageSettings = {
  storageTempFileDestination: avatarProfile.tmpDestination,
  storageFileDestination: avatarProfile.destination,
  storageFileExtensionTypes: avatarProfile.extensionTypes,
  storageFileMIMETypes: avatarProfile.mimeTypes,
  storageFileMaxSize: avatarProfile.maxSize,
  storageEngine: diskStorageEngine(avatarProfile.tmpDestination)
}

const avatarApiStorageSettings: IStorageSettings = {
  storageTempFileDestination: avatarProfile.tmpDestination,
  storageFileDestination: avatarProfile.destination,
  storageFileExtensionTypes: avatarProfile.extensionTypes,
  storageFileMIMETypes: avatarProfile.mimeTypes,
  storageFileMaxSize: avatarProfile.maxSize,
  storageRequest: avatarProfile.request,
  storageEngine: apiStorageEngine(avatarProfile.request)
}

const resumeDiskStorageSettings: IStorageSettings = {
  storageTempFileDestination: resumeProfile.tmpDestination,
  storageFileDestination: resumeProfile.destination,
  storageFileExtensionTypes: resumeProfile.extensionTypes,
  storageFileMIMETypes: resumeProfile.mimeTypes,
  storageFileMaxSize: resumeProfile.maxSize,
  storageEngine: diskStorageEngine(resumeProfile.tmpDestination)
}

const resumeApiStorageSettings: IStorageSettings = {
  storageTempFileDestination: resumeProfile.tmpDestination,
  storageFileDestination: resumeProfile.destination,
  storageFileExtensionTypes: resumeProfile.extensionTypes,
  storageFileMIMETypes: resumeProfile.mimeTypes,
  storageFileMaxSize: resumeProfile.maxSize,
  storageRequest: resumeProfile.request,
  storageEngine: apiStorageEngine(resumeProfile.request)
}

const exportStorage = () => {
  const resumeStorageSettings = (storageType === 'disk') ? resumeDiskStorageSettings : resumeApiStorageSettings
  const avatarStorageSettings = (storageType === 'disk') ? avatarDiskStorageSettings : avatarApiStorageSettings
  return [resumeStorageSettings, avatarStorageSettings]
}

const exportStorageService = (resumeStorageSettings: IStorageSettings, avatarStorageSettings: IStorageSettings) => {
  const resumeStorageService = (storageType === 'disk') ? new DiskStorageService(resumeStorageSettings) : new ApiStorageService(resumeStorageSettings)
  const avatarStorageService = (storageType === 'disk') ? new DiskStorageService(avatarStorageSettings) : new ApiStorageService(avatarStorageSettings)
  return [resumeStorageService, avatarStorageService]
}

const [resumeStorageSettings, avatarStorageSettings] = exportStorage()
const [resumeStorageService, avatarStorageService] = exportStorageService(resumeStorageSettings, avatarStorageSettings)

export { resumeStorageSettings, avatarStorageSettings }
export { resumeStorageService, avatarStorageService }
