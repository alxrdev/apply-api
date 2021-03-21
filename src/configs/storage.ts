import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

const storageType = process.env.STORAGE_TYPE || 'disk'
const storageProfiles = (process.env.STORAGE_PROFILES)
  ? JSON.parse(process.env.STORAGE_PROFILES)
  : {
    avatar: { tmpDestination: '', destination: '', extensionTypes: '', mimeTypes: '', maxSize: '' },
    resume: { tmpDestination: '', destination: '', extensionTypes: '', mimeTypes: '', maxSize: '' }
  }

export { storageType }

export interface StorageProfile {
  tmpDestination: string
  destination: string
  extensionTypes: string
  mimeTypes: string
  maxSize: number
  request?: string
}

export const avatarProfile: StorageProfile = storageProfiles.avatar as StorageProfile
export const resumeProfile: StorageProfile = storageProfiles.resume as StorageProfile
