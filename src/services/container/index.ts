import { container } from 'tsyringe'

import IJobRepository from '../../modules/jobs/repositories/IJobRepository'
import JobRepository from '../../modules/jobs/repositories/mongodb/JobRepository'

import IUserRepository from '../../modules/users/repositories/IUserRepository'
import UserRepository from '../../modules/users/repositories/mongodb/UserRepository'

import IStorageService from '../storage/interfaces/IStorageService'
import { resumeStorageService, avatarStorageService } from '../storage'

import IMailService from '../email/interfaces/IMailService'
import { mailService } from '../email'

import IAuthService from '../auth/interfaces/IAuthService'
import { authService } from '../auth'

container.registerSingleton<IJobRepository>('JobRepository', JobRepository)

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)

container.register<IStorageService>('ResumeStorageService', { useValue: resumeStorageService })

container.register<IStorageService>('AvatarStorageService', { useValue: avatarStorageService })

container.register<IMailService>('MailService', { useValue: mailService })

container.register<IAuthService>('AuthService', { useValue: authService })
