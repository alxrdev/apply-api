import { container } from 'tsyringe'

import IJobRepository from '../../modules/jobs/repositories/IJobRepository'
import JobRepository from '../../modules/jobs/repositories/mongodb/JobRepository'

import IUserRepository from '../../modules/users/repositories/IUserRepository'
import UserRepository from '../../modules/users/repositories/mongodb/UserRepository'

import IStorageService from '../storage/interfaces/IStorageService'
import DiskStorageService from '../storage/DiskStorageService'

import { IStorageSettings, diskStorage } from '../../configs/storage'

import IMailService from '../email/interfaces/IMailService'
import Mailtrap from '../email/Mailtrap'

container.registerSingleton<IJobRepository>('JobRepository', JobRepository)

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)

container.register<IStorageService>('DiskStorageService', DiskStorageService)

container.register<IStorageSettings>('StorageSettings', { useValue: diskStorage })

container.register<IMailService>('Mailtrap', Mailtrap)
