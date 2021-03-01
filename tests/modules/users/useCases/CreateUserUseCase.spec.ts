import { CreateUserUseCase } from '@modules/users/useCases'
import { AppError, InvalidArgumentError } from '@errors/index'
import { CreateUserDTO } from '@modules/users/dtos'
import { User } from '@modules/users/entities'
import { UserAlreadyExistsError } from '@modules/users/errors'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'

const makeUser = (fields = {}) : CreateUserDTO => {
  const data = { name: 'user', email: 'user@user.com', password: 'password', confirmPassword: 'password', role: 'user', ...fields }
  const user = new CreateUserDTO()
  return Object.assign(user, data)
}

let userRepository: FakeUserRepository

const makeSut = () : CreateUserUseCase => new CreateUserUseCase(userRepository)

describe('Test the CreateUserUseCase class', () => {
  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))
  })

  it('Should create and return a new user', async () => {
    const createUserUseCase = makeSut()
    const spyCreate = jest.spyOn(userRepository, 'create')
    const user = makeUser()

    await expect(createUserUseCase.execute(user))
      .resolves
      .toBeInstanceOf(User)
    expect(spyCreate).toHaveBeenCalled()
  })

  it('Should throw an UserAlreadyExistsError', async () => {
    const createUserUseCase = makeSut()
    const spyCreate = jest.spyOn(userRepository, 'findByEmail')
    const user = makeUser({ email: 'user@email.com' })

    await expect(createUserUseCase.execute(user))
      .rejects
      .toThrowError(UserAlreadyExistsError)
    expect(spyCreate).toHaveBeenCalled()
  })

  it('Should throw an AppError when a required fields is empty', async () => {
    const createUserUseCase = makeSut()
    const user = makeUser({ name: '' })

    await expect(createUserUseCase.execute(user))
      .rejects
      .toThrowError(AppError)
  })

  it('Should throw an InvalidArgumentError when the password and password confirmation do not match', async () => {
    const createUserUseCase = makeSut()
    const user = makeUser({ password: 'password', confirmPassword: 'invalidpass' })

    await expect(createUserUseCase.execute(user))
      .rejects
      .toThrowError(InvalidArgumentError)
  })

  it('Should throw an AppError when an invalid role is provided', async () => {
    const createUserUseCase = makeSut()
    const user = makeUser({ role: 'invalid' })

    await expect(createUserUseCase.execute(user))
      .rejects
      .toThrowError(AppError)
  })
})
