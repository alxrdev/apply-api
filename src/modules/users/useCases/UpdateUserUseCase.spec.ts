import { UpdateUserUseCase } from '.'
import { AppError } from '../../../errors'
import { UpdateUserDTO } from '../dtos'
import { User } from '../entities'
import { UserNotFoundError } from '../errors'
import UserRepository from '../repositories/mongodb/UserRepository'

const mockUpdate = jest.fn().mockReturnValue(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

const mockFindById = jest.fn()

jest.mock('../repositories/mongodb/UserRepository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            update: mockUpdate,
            findById: mockFindById
        }
    })
})

const makeUser = (fields = {}) : UpdateUserDTO => {
    const data = { id: '1', authUserId: '1', name: 'user', headline: 'My headline', address: 'my address', bio: 'my bio', ...fields }
    const user = new UpdateUserDTO()
    user.id = data.id
    user.authUserId = data.authUserId
    user.name = data.name
    user.headline = data.headline
    user.address = data.address
    user.bio = data.bio
    return user
}

const makeSut = () : UpdateUserUseCase => new UpdateUserUseCase(new UserRepository())

describe('Test the UpdateUserUseCase class', () => {
    it('Should update and return the user', async () => {
        mockFindById.mockReturnValue(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

        const updateUserUseCase = makeSut()

        await expect(updateUserUseCase.execute(makeUser())).resolves.toBeInstanceOf(User)
    })

    it('Should throw an AppError when the user to update is not the authenticated user', async () => {
        const updateUserUseCase = makeSut()
        
        await expect(updateUserUseCase.execute(makeUser({ authUserId: '2' }))).rejects.toThrowError(AppError)
    })

    it('Should throw an AppError when the user do not exists', async () => {
        mockFindById.mockImplementation(() => {
            throw new UserNotFoundError('User not found.', false, 404)
        })

        const updateUserUseCase = makeSut()

        await expect(updateUserUseCase.execute(makeUser())).rejects.toThrowError(UserNotFoundError)
    })
})