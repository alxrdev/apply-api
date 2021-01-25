import { CreateUserUseCase } from '.'
import { AppError, InvalidArgumentError } from '../../../errors'
import { CreateUserDTO } from '../dtos'
import { User } from '../entities'
import { UserAlreadyExistsError, UserNotFoundError } from '../errors'
import UserRepository from '../repositories/mongodb/UserRepository'

const mockCreate = jest.fn().mockReturnValue(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

const mockFindByEmail = jest.fn()

jest.mock('../repositories/mongodb/UserRepository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: mockCreate,
            findByEmail: mockFindByEmail
        }
    })
})

const makeUser = (fields = {}) : CreateUserDTO => {
    const data = { name: 'user', email: 'user@user.com', password: 'password', confirmPassword: 'password', role: 'user', ...fields }
    const user = new CreateUserDTO()
    user.name = data.name
    user.email = data.email
    user.password = data.password
    user.confirmPassword = data.confirmPassword
    user.role = data.role
    return user
}

const makeSut = () : CreateUserUseCase => new CreateUserUseCase(new UserRepository())

describe('Test the CreateUserUseCase class', () => {
    it('Should create and return a new user', async () => {
        mockFindByEmail.mockImplementation(() => {
            throw new UserNotFoundError('User not found.', false, 404)
        })

        const createUserUseCase = makeSut()

        await expect(createUserUseCase.execute(makeUser())).resolves.toBeInstanceOf(User)
    })

    it('Should throw an UserAlreadyExistsError', async () => {
        mockFindByEmail.mockReturnValue(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

        const createUserUseCase = makeSut()
        
        await expect(createUserUseCase.execute(makeUser())).rejects.toThrowError(UserAlreadyExistsError)
    })

    it('Should throw an AppError when a required fields is empty', async () => {
        mockFindByEmail.mockImplementation(() => {
            throw new UserNotFoundError('User not found.', false, 404)
        })

        const createUserUseCase = makeSut()

        await expect(createUserUseCase.execute(makeUser({ name: '' }))).rejects.toThrowError(AppError)
    })

    it('Should throw an InvalidArgumentError when the password and password confirmation do not match', async () => {
        const createUserUseCase = makeSut()

        await expect(createUserUseCase.execute(makeUser({ password: 'password', confirmPassword: 'invalidpass' })))
            .rejects
            .toThrowError(InvalidArgumentError)
    })

    it('Should throw an AppError when an invalid role is provided', async () => {
        const createUserUseCase = makeSut()

        await expect(createUserUseCase.execute(makeUser({ role: 'invalid' }))).rejects.toThrowError(AppError)
    })
})