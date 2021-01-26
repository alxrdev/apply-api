import { DeleteUserUseCase } from "."
import { AppError } from "../../../errors"
import DiskStorageService from "../../../services/storage/DiskStorageService"
import JobRepository from "../../jobs/repositories/mongodb/JobRepository"
import { DeleteUserDTO } from "../dtos"
import { User } from "../entities"
import UserRepository from "../repositories/mongodb/UserRepository"

const mockFindById = jest.fn().mockReturnValue(new User('1', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))
const mockDelete = jest.fn()

jest.mock('../repositories/mongodb/UserRepository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            findById: mockFindById,
            delete: mockDelete
        }
    })
})

const mockRemoveApplyToJobs = jest.fn().mockReturnValue({ files: [{ file: '123.pdf' }, { file: '123.pdf' }] })

jest.mock('../../jobs/repositories/mongodb/JobRepository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            removeApplyToJobs: mockRemoveApplyToJobs
        }
    })
})

const mockStorageDelete = jest.fn()

jest.mock('../../../services/storage/DiskStorageService', () => {
    return jest.fn().mockImplementation(() => {
        return { delete: mockStorageDelete }
    })
})

const makeDto = (fields = {}) : DeleteUserDTO => {
    const data = { id: '1', authUserId: '1', ...fields }
    const dto = new DeleteUserDTO()
    dto.id = data.id
    dto.authUserId = data.authUserId
    return dto
}

const makeSut = () : DeleteUserUseCase => new DeleteUserUseCase(new UserRepository(), new JobRepository(), new DiskStorageService({storageFileDestination:'', storageTempFileDestination:''}))

describe('Test the DeleteUserUseCase', () => {
    beforeEach(() => {
        mockFindById.mock.calls = []
        mockDelete.mock.calls = []
        mockRemoveApplyToJobs.mock.calls = []
        mockStorageDelete.mock.calls = []
    })

    it('Should throw an AppError when the user to delete is not the authenticated user', async () => {
        const deleteUserUseCase = makeSut()

        await expect(deleteUserUseCase.execute(makeDto({ authUserId: '2' }))).rejects.toThrowError(AppError)
        expect(mockFindById.mock.calls.length).toBe(1)
    })

    it('Should delete the user', async () => {
        const deleteUserUseCase = makeSut()

        await expect(deleteUserUseCase.execute(makeDto())).resolves.not.toThrowError(AppError)
        expect(mockFindById.mock.calls.length).toBe(1)
        expect(mockDelete.mock.calls.length).toBe(1)
    })

    it('Should delete the user files', async () => {
        const deleteUserUseCase = makeSut()

        await expect(deleteUserUseCase.execute(makeDto())).resolves.not.toThrowError(AppError)
        expect(mockRemoveApplyToJobs.mock.calls.length).toBe(1)
        expect(mockStorageDelete.mock.calls.length).toBe(3)
    })

    it('Should delete the employer avatar', async () => {
        mockFindById.mockReturnValue(new User('1', 'user', 'user@email.com', 'employer', 'user.jpg', 'password', '', '', ''))

        const deleteUserUseCase = makeSut()

        await expect(deleteUserUseCase.execute(makeDto())).resolves.not.toThrowError(AppError)
        expect(mockStorageDelete.mock.calls.length).toBe(1)
        expect(mockRemoveApplyToJobs.mock.calls.length).toBe(0)
    })
})
