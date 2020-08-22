import UserRepository from '../repositories/mongodb/UserRepository'
import CreateUserUseCase from '../useCases/CreateUserUseCase'

export const userRepository = new UserRepository()

export const createUserUseCase = new CreateUserUseCase(userRepository)
