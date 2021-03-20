import { container } from 'tsyringe'

import '@providers/container'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import FakeJobRepository from '@modules/jobs/repositories/fake/FakeJobRepository'
import { CreateUserUseCase, DeleteUserUseCase, ShowUserUseCase, UpdateUserUseCase } from '@modules/users/useCases'
import { AuthenticateUserUseCase } from '@modules/auth/useCases'
import IStorageService from '@providers/storage/interfaces/IStorageService'
import IMailProvider from '@src/providers/email/interfaces/IMailProvider'
import FakeStorageService from '@providers/storage/FakeStorageService'
import FakeMail from '@providers/email/FakeMail'
import IAuthProvider from '@src/providers/auth/interfaces/IAuthProvider'
import JwtAuthProvider from '@src/providers/auth/JwtAuthProvider'

container.register<IUserRepository>('UserRepository', FakeUserRepository)
container.register<IJobRepository>('JobRepository', FakeJobRepository)

container.register<IStorageService>('ResumeStorageService', FakeStorageService)
container.register<IStorageService>('AvatarStorageService', FakeStorageService)

container.register<IMailProvider>('MailProvider', FakeMail)

container.register<IAuthProvider>('AuthProvider', { useValue: new JwtAuthProvider({ jwtSecret: 'myToken', jwtExpiresTime: '15' }) })

// Users module
export const createUserUseCase = container.resolve(CreateUserUseCase)
container.registerInstance(CreateUserUseCase, createUserUseCase)

export const showUserUseCase = container.resolve(ShowUserUseCase)
container.registerInstance(ShowUserUseCase, showUserUseCase)

export const updateUserUseCase = container.resolve(UpdateUserUseCase)
container.registerInstance(UpdateUserUseCase, updateUserUseCase)

export const deleteUserUseCase = container.resolve(DeleteUserUseCase)
container.registerInstance(DeleteUserUseCase, deleteUserUseCase)

// Auth module
export const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)
container.registerInstance(AuthenticateUserUseCase, authenticateUserUseCase)
