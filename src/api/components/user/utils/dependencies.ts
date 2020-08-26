import UserRepository from '../repositories/mongodb/UserRepository'
import Mailtrap from '../../../../services/email/Mailtrap'
import { jobRepository } from '../../job/utils/dependencies'
import { diskStorage } from '../../../../configs/storage'
import DiskStorageService from '../../../../services/storage/DiskStorageService'

import CreateUserUseCase from '../useCases/CreateUserUseCase'
import ShowUserUseCase from '../useCases/ShowUserUseCase'
import AuthenticateUserUseCase from '../useCases/AuthenticateUserUseCase'
import ForgotPasswordUseCase from '../useCases/ForgotPasswordUseCase'
import ResetPasswordUseCase from '../useCases/ResetPasswordUseCase'
import DeleteUserUseCase from '../useCases/DeleteUserUseCase'

export const userRepository = new UserRepository()

export const mailtrap = new Mailtrap()

export const diskStorageService = new DiskStorageService(diskStorage)

export const createUserUseCase = new CreateUserUseCase(userRepository)

export const showUserUseCase = new ShowUserUseCase(userRepository)

export const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository)

export const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, mailtrap)

export const resetPasswordUseCase = new ResetPasswordUseCase(userRepository)

export const deleteUserUseCase = new DeleteUserUseCase(userRepository, jobRepository, diskStorageService)
