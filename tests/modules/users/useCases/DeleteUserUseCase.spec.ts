import { DeleteUserUseCase } from "@modules/users/useCases"
import { AppError } from "@errors/index"
import DiskStorageService from "@services/storage/DiskStorageService"
import { DeleteUserDTO } from "@modules/users/dtos"
import { User } from "@modules/users/entities"
import FakeUserRepository from "@modules/users/repositories/fake/FakeUserRepository"
import FakeJobRepository from "@modules/jobs/repositories/fake/FakeJobRepository"
import IUserRepository from "@modules/users/repositories/IUserRepository"
import IJobRepository from "@modules/jobs/repositories/IJobRepository"
import { Address, Job } from "@modules/jobs/entities"

const mockStorageDelete = jest.fn()

jest.mock('@services/storage/DiskStorageService', () => {
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

const makeJob = async (fields = {}) : Promise<Job> => {
	const data = {
		id: '1', 
		user: await userRepository.findById('1'), 
		title: 'First job',
		description: 'this is the first job', 
		address: new Address('ES', 'São Mateus'), 
		jobType: 'full-time', 
		salary: 1200.00, 
		createdAt: new Date(),
		...fields
	}
	
	return new Job(data.id, data.user, data.title, data.description, data.address, data.jobType, data.salary, data.createdAt)
}

let userRepository: IUserRepository
let jobRepository: IJobRepository

const makeSut = () : DeleteUserUseCase => new DeleteUserUseCase(userRepository, jobRepository, new DiskStorageService({storageFileDestination:'', storageTempFileDestination:''}))

describe('Test the DeleteUserUseCase', () => {
	beforeEach(async () => {
		userRepository = new FakeUserRepository()
		userRepository.create(new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))
		userRepository.create(new User('2', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))
		userRepository.create(new User('3', 'user', 'user3@email.com', 'user', 'user3.jpg', 'password', '', '', ''))

		jobRepository = new FakeJobRepository(userRepository)
		jobRepository.create(await makeJob({ id: '1' }))
		jobRepository.create(await makeJob({ id: '2' }))
		jobRepository.applyToJob('1', '2', '123.pdf')
		jobRepository.applyToJob('2', '2', '123.pdf')

		mockStorageDelete.mock.calls = []
	})

	it('Should throw an AppError when the user to delete is not the authenticated user', async () => {
		const deleteUserUseCase = makeSut()
		const spyFindById = jest.spyOn(userRepository, 'findById')
		const user = makeDto({ authUserId: '2' })

		await expect(deleteUserUseCase.execute(user))
			.rejects
			.toThrowError(AppError)
		expect(spyFindById).toHaveBeenCalled()
	})

	it('Should delete the user', async () => {
		const deleteUserUseCase = makeSut()
		const spyFindById = jest.spyOn(userRepository, 'findById')
		const spyDelete = jest.spyOn(userRepository, 'delete')
		const user = makeDto()

		await expect(deleteUserUseCase.execute(user))
			.resolves
			.not.toThrowError(AppError)
		expect(spyFindById).toHaveBeenCalled()
		expect(spyDelete).toHaveBeenCalled()
	})

	it('Should delete the user files', async () => {
		const deleteUserUseCase = makeSut()
		const spyRemoveApplyToJobs = jest.spyOn(jobRepository, 'removeApplyToJobs')
		const user = makeDto({ id: '2', authUserId: '2' })

		await expect(deleteUserUseCase.execute(user))
			.resolves
			.not.toThrowError(AppError)
		expect(spyRemoveApplyToJobs).toHaveBeenCalled()
		expect(mockStorageDelete.mock.calls.length).toBe(3)
	})

	it('Should delete the employer avatar', async () => {
		const deleteUserUseCase = makeSut()
		const user = makeDto({ id: '1', authUserId: '1' })

		await expect(deleteUserUseCase.execute(user))
			.resolves
			.not.toThrowError(AppError)
		expect(mockStorageDelete.mock.calls.length).toBe(1)
	})
})
