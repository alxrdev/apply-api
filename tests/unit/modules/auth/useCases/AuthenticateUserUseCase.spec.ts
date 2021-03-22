import { AppError } from '@errors/index'
import { AuthDTO } from '@modules/auth/dtos'
import { AuthenticationError } from '@modules/auth/errors'
import { AuthenticateUserUseCase } from '@modules/auth/useCases'
import { CreateUserDTO } from '@modules/users/dtos'
import { User } from '@modules/users/entities'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import { CreateUserUseCase } from '@modules/users/useCases'
import FakeAuthProvider from '@src/providers/auth/FakeAuthProvider'
import IAuthProvider from '@src/providers/auth/interfaces/IAuthProvider'

const makeDto = (fields = {}) : AuthDTO => {
  const data = { email: 'employeer@email.com', password: 'password', ...fields }
  return Object.assign(new AuthDTO(), data)
}

let userRepository: IUserRepository
let fakeAuthProvider: IAuthProvider

const makeSut = () : AuthenticateUserUseCase => new AuthenticateUserUseCase(userRepository, fakeAuthProvider)

describe('Test the AuthenticateUserUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()

    await new CreateUserUseCase(userRepository).execute(Object.assign(new CreateUserDTO(), { name: 'employer', email: 'employeer@email.com', role: 'employer', password: 'password', confirmPassword: 'password' }))

    fakeAuthProvider = new FakeAuthProvider()
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const sut = makeSut()
    const dto = makeDto({ email: '', password: '' })

    await expect(sut.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw an AuthenticationError when the email does not exists', async () => {
    const sut = makeSut()
    const dto = makeDto({ email: 'invalid@email.com' })
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')

    await expect(sut.execute(dto)).rejects.toThrowError(AuthenticationError)
    expect(spyFindByEmail).toHaveBeenCalled()
  })

  it('Should throw an AuthenticationError when the password does not match', async () => {
    const sut = makeSut()
    const dto = makeDto({ password: 'invalidPassword' })
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')

    await expect(sut.execute(dto)).rejects.toThrowError(AuthenticationError)
    expect(spyFindByEmail).toHaveBeenCalled()
  })

  it('Should return the authenticated user and the token', async () => {
    const sut = makeSut()
    const dto = makeDto()
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')
    const spyAuthenticateUser = jest.spyOn(fakeAuthProvider, 'authenticateUser')

    const auth = await sut.execute(dto)

    expect(auth).toHaveProperty('user')
    expect(auth).toHaveProperty('token')
    expect(auth.user).toBeInstanceOf(User)
    expect(auth.token.length).toBeGreaterThan(0)
    expect(spyFindByEmail).toHaveBeenCalled()
    expect(spyAuthenticateUser).toHaveBeenCalled()
  })
})
