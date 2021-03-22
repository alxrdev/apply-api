import { container } from 'tsyringe'

import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import JobRepository from '@modules/jobs/repositories/mongodb/JobRepository'

import IUserRepository from '@modules/users/repositories/IUserRepository'
import UserRepository from '@modules/users/repositories/mongodb/UserRepository'

import IStorageService from '@providers/storage/interfaces/IStorageService'
import { resumeStorageService, avatarStorageService } from '@providers/storage'

import IMailProvider from '@providers/email/interfaces/IMailProvider'
import Mailtrap from '@providers/email/Mailtrap'
import { smtpProfile } from '@configs/email'

import IAuthProvider from '@providers/auth/interfaces/IAuthProvider'
import JwtAuthProvider from '@providers/auth/JwtAuthProvider'
import { jwtProfile } from '@configs/auth'

container.registerSingleton<IJobRepository>('JobRepository', JobRepository)

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)

container.register<IStorageService>('ResumeStorageService', { useValue: resumeStorageService })

container.register<IStorageService>('AvatarStorageService', { useValue: avatarStorageService })

container.register<IMailProvider>('MailProvider', {
  useValue: new Mailtrap({
    senderName: smtpProfile.senderName,
    senderEmail: smtpProfile.senderEmail,
    host: smtpProfile.host,
    port: smtpProfile.port,
    username: smtpProfile.username,
    password: smtpProfile.password
  })
})

container.register<IAuthProvider>('AuthProvider', {
  useValue: new JwtAuthProvider({
    jwtSecret: jwtProfile.jwtSecret,
    jwtExpiresTime: jwtProfile.jwtExpiresTime
  })
})
