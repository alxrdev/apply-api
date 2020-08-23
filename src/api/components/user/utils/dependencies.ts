import UserRepository from '../repositories/mongodb/UserRepository'
import CreateUserUseCase from '../useCases/CreateUserUseCase'
import ShowUserUseCase from '../useCases/ShowUserUseCase'
import AuthenticateUserUseCase from '../useCases/AuthenticateUserUseCase'

export const userRepository = new UserRepository()

export const createUserUseCase = new CreateUserUseCase(userRepository)

export const showUserUseCase = new ShowUserUseCase(userRepository)

export const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository)
