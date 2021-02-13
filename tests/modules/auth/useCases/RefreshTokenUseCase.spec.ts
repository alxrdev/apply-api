import { AuthenticationError } from "@modules/auth/errors"
import { RefreshTokenUseCase } from "@modules/auth/useCases"
import { User } from "@modules/users/entities"
import { UserNotFoundError } from "@modules/users/errors"
import FakeUserRepository from "@modules/users/repositories/fake/FakeUserRepository"
import IUserRepository from "@modules/users/repositories/IUserRepository"
import ITokenBasedAuthService from "@services/auth/interfaces/ITokenBasedAuthService"
import FakeAuthService from "@services/auth/FakeAuthService"

const makeUser = () => new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', '')

let userRepository: IUserRepository
let fakeAuthService: ITokenBasedAuthService

const makeSut = () : RefreshTokenUseCase => new RefreshTokenUseCase(userRepository, fakeAuthService)

describe('Test the RefreshTokenUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(makeUser())
    
    fakeAuthService = new FakeAuthService()
  })

  it('Should throw an AuthenticationError when an invalid token is provided', async () => {
    const sut = makeSut()
    
    await expect(sut.execute('')).rejects.toThrowError(AuthenticationError)
  })

  it('Should throw an AuthenticationError when trying to refresh the token after the timeout', async () => {
    const sut = makeSut()
    const spyDecodeToken = jest.spyOn(fakeAuthService, 'decodeToken')
      .mockImplementation(() => {
        const limit = new Date(Date.now())
        limit.setHours(limit.getHours() - 5)
        return { id: '1', rule: 'employer', exp: limit.getTime() }
      })
    
    await expect(sut.execute('myFakeToken')).rejects.toThrowError(AuthenticationError)
    expect(spyDecodeToken).toHaveBeenCalled()

    spyDecodeToken.mockReset()
    spyDecodeToken.mockRestore()
  })

  it('Should throw an UserNotFoundError when the user in the token payload does not exist', async () => {
    const sut = makeSut()
    const spyDecodeToken = jest.spyOn(fakeAuthService, 'decodeToken')
      .mockImplementation(() => ({ id: '2', rule: 'employer', exp: Date.now() }))
    const spyFindById = jest.spyOn(userRepository, 'findById')
    
    await expect(sut.execute('myFakeToken')).rejects.toThrowError(UserNotFoundError)
    expect(spyDecodeToken).toHaveBeenCalled()
    expect(spyFindById).toHaveBeenCalled()

    spyDecodeToken.mockReset()
    spyDecodeToken.mockRestore()
  })

  it('Should return the authenticated user and the token', async () => {
    const sut = makeSut()
    const spyDecodeToken = jest.spyOn(fakeAuthService, 'decodeToken')
    const spyFindById = jest.spyOn(userRepository, 'findById')
    
    const auth = await sut.execute('myFakeToken')

    expect(auth).toHaveProperty('user')
    expect(auth).toHaveProperty('token')
    expect(auth.token.length).toBeGreaterThan(0)
    expect(spyDecodeToken).toHaveBeenCalled()
    expect(spyFindById).toHaveBeenCalled()    
  })
})