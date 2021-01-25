import { ShowUserUseCase } from '.'
import { User } from '../entities'
import { UserNotFoundError } from '../errors'
import UserRepository from '../repositories/mongodb/UserRepository'

const mockFindByEmail = jest.fn()
const mockFindById = jest.fn()

jest.mock('../repositories/mongodb/UserRepository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            findByEmail: mockFindByEmail,
            findById: mockFindById
        }
    })
})

const makeSut = () : ShowUserUseCase => new ShowUserUseCase(new UserRepository())

describe('Test the ShowUserUseCase class', () => {
    it('Should find an user by email', async () => {
        mockFindByEmail.mockReturnValue(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

        const showUserUseCase = makeSut()

        const result = await showUserUseCase.execute('user@email.com')

        expect(result).toBeInstanceOf(User)
        expect(result.email).toBe('user@email.com')
        expect(mockFindByEmail.mock.calls.length).toBe(1)
    })

    it('Should find an user by id', async () => {
        mockFindById.mockReturnValue(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

        const showUserUseCase = makeSut()

        const result = await showUserUseCase.execute('1')

        expect(result).toBeInstanceOf(User)
        expect(result.id).toBe('1')
        expect(mockFindById.mock.calls.length).toBe(1)
    })

    it('Should return an UserNotFoundError when the user does not exists', async () => {
        mockFindByEmail.mockImplementation(() => {
            throw new UserNotFoundError('User not found.', false, 404)
        })

        const showUserUseCase = makeSut()

        await expect(showUserUseCase.execute('user@email.com')).rejects.toThrowError(UserNotFoundError)
    })
})