import { container } from 'tsyringe'

import IJobRepository from '../../modules/jobs/repositories/IJobRepository'
import JobRepository from '../../modules/jobs/repositories/mongodb/JobRepository'

import IUserRepository from '../../modules/users/repositories/IUserRepository'
import UserRepository from '../../modules/users/repositories/mongodb/UserRepository'

import IStorageService from '../storage/interfaces/IStorageService'
import DiskStorageService from '../storage/DiskStorageService'

import { resumeStorageSettings, avatarStorageSettings } from '../../configs/storage'

import IMailService from '../email/interfaces/IMailService'
import Mailtrap from '../email/Mailtrap'

import IMailSettings from '../email/interfaces/IMailSettings'
import { mailSettings } from '../../configs/email'

container.registerSingleton<IJobRepository>('JobRepository', JobRepository)

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)

container.register<IStorageService>('ResumeStorageService', { useValue: new DiskStorageService(resumeStorageSettings) })

container.register<IStorageService>('AvatarStorageService', { useValue: new DiskStorageService(avatarStorageSettings) })

container.register<IMailService>('MailService', Mailtrap)

container.register<IMailSettings>('MailSettings', { useValue: mailSettings })
