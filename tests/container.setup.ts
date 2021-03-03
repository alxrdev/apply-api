import { container } from 'tsyringe'

import '@services/container'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import FakeUserRepository from '@src/modules/users/repositories/fake/FakeUserRepository'
import IJobRepository from '@src/modules/jobs/repositories/IJobRepository'
import FakeJobRepository from '@src/modules/jobs/repositories/fake/FakeJobRepository'
import { CreateUserUseCase, DeleteUserUseCase, ShowUserUseCase, UpdateUserUseCase } from '@modules/users/useCases'

container.register<IUserRepository>('UserRepository', FakeUserRepository)
container.register<IJobRepository>('JobRepository', FakeJobRepository)

export const createUserUseCase = container.resolve(CreateUserUseCase)
container.registerInstance(CreateUserUseCase, createUserUseCase)

export const showUserUseCase = container.resolve(ShowUserUseCase)
container.registerInstance(ShowUserUseCase, showUserUseCase)

export const updateUserUseCase = container.resolve(UpdateUserUseCase)
container.registerInstance(UpdateUserUseCase, updateUserUseCase)

export const deleteUserUseCase = container.resolve(DeleteUserUseCase)
container.registerInstance(DeleteUserUseCase, deleteUserUseCase)
