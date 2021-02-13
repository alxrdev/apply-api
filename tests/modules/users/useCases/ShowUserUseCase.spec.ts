import { ShowUserUseCase } from '@modules/users/useCases'
import { User } from '@modules/users/entities'
import { UserNotFoundError } from '@modules/users/errors'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'

let userRepository: IUserRepository

const makeSut = () : ShowUserUseCase => new ShowUserUseCase(userRepository)

describe('Test the ShowUserUseCase class', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    
    beforeAll(async () => {
        userRepository = new FakeUserRepository()
        await userRepository.create(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))
    })

    it('Should find an user by email', async () => {
        const showUserUseCase = makeSut()
        const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')

        const result = await showUserUseCase.execute('user@email.com')

        expect(result).toBeInstanceOf(User)
        expect(result.email).toBe('user@email.com')
        expect(spyFindByEmail).toHaveBeenCalled()
    })

    it('Should find an user by id', async () => {
        const showUserUseCase = makeSut()
        const spyFindById = jest.spyOn(userRepository, 'findById')

        const result = await showUserUseCase.execute('1')

        expect(result).toBeInstanceOf(User)
        expect(result.id).toBe('1')
        expect(spyFindById).toHaveBeenCalled()
    })

    it('Should return an UserNotFoundError when the user does not exists', async () => {
        const showUserUseCase = makeSut()

        await expect(showUserUseCase.execute('user@invalid.com')).rejects.toThrowError(UserNotFoundError)
    })
})