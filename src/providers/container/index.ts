import { container } from 'tsyringe'

import IJobRepository from '../../modules/jobs/repositories/IJobRepository'
import JobRepository from '../../modules/jobs/repositories/mongodb/JobRepository'

import IUserRepository from '../../modules/users/repositories/IUserRepository'
import UserRepository from '../../modules/users/repositories/mongodb/UserRepository'

import IStorageService from '../storage/interfaces/IStorageService'
import { resumeStorageService, avatarStorageService } from '../storage'

import IMailProvider from '../email/interfaces/IMailProvider'
import { mailProvider } from '../email'

import IAuthProvider from '../auth/interfaces/IAuthProvider'
import JwtAuthProvider from '../auth/JwtAuthProvider'

container.registerSingleton<IJobRepository>('JobRepository', JobRepository)

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)

container.register<IStorageService>('ResumeStorageService', { useValue: resumeStorageService })

container.register<IStorageService>('AvatarStorageService', { useValue: avatarStorageService })

container.register<IMailProvider>('MailProvider', { useValue: mailProvider })

container.register<IAuthProvider>('AuthProvider', { useValue: new JwtAuthProvider() })
