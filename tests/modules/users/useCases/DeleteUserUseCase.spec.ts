import { DeleteUserUseCase } from "@modules/users/useCases"
import { AppError } from "@errors/index"
import { DeleteUserDTO } from "@modules/users/dtos"
import { User } from "@modules/users/entities"
import FakeUserRepository from "@modules/users/repositories/fake/FakeUserRepository"
import FakeJobRepository from "@modules/jobs/repositories/fake/FakeJobRepository"
import IUserRepository from "@modules/users/repositories/IUserRepository"
import IJobRepository from "@modules/jobs/repositories/IJobRepository"
import { Address, Job } from "@modules/jobs/entities"
import FakeStorageService from "@services/storage/FakeStorageService"
import IStorageService from "@services/storage/interfaces/IStorageService"

const makeDto = (fields = {}) : DeleteUserDTO => {
	const data = { id: '1', authUserId: '1', ...fields }
	const dto = new DeleteUserDTO()
	return Object.assign(dto, data)
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
let fakeStorage: IStorageService

const makeSut = () : DeleteUserUseCase => new DeleteUserUseCase(userRepository, jobRepository, fakeStorage)

describe('Test the DeleteUserUseCase', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	beforeAll(async () => {
		userRepository = new FakeUserRepository()
		await userRepository.create(new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))
		await userRepository.create(new User('2', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))
		await userRepository.create(new User('3', 'user', 'user3@email.com', 'user', 'user3.jpg', 'password', '', '', ''))
		await userRepository.create(new User('4', 'user', 'user3@email.com', 'user', 'user4.jpg', 'password', '', '', ''))

		jobRepository = new FakeJobRepository(userRepository)
		await jobRepository.create(await makeJob({ id: '1' }))
		await jobRepository.create(await makeJob({ id: '2' }))
		await jobRepository.applyToJob('1', '2', '123.pdf')
		await jobRepository.applyToJob('2', '2', '123.pdf')

		fakeStorage = new FakeStorageService()
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
		const user = makeDto({ id: '4', authUserId: '4' })

		await expect(deleteUserUseCase.execute(user))
			.resolves
			.not.toThrowError(AppError)
		expect(spyFindById).toHaveBeenCalled()
		expect(spyDelete).toHaveBeenCalled()
	})

	it('Should delete the user files', async () => {
		const deleteUserUseCase = makeSut()
		const spyRemoveApplyToJobs = jest.spyOn(jobRepository, 'removeApplyToJobs')
		const spyStorageDelete = jest.spyOn(fakeStorage, 'delete')
		const user = makeDto({ id: '2', authUserId: '2' })

		await expect(deleteUserUseCase.execute(user))
			.resolves
			.not.toThrowError(AppError)
		expect(spyRemoveApplyToJobs).toHaveBeenCalled()
		expect(spyStorageDelete).toHaveBeenCalledTimes(3)
	})

	it('Should delete the employer avatar', async () => {
		const deleteUserUseCase = makeSut()
		const spyStorageDelete = jest.spyOn(fakeStorage, 'delete')
		const user = makeDto({ id: '1', authUserId: '1' })

		await expect(deleteUserUseCase.execute(user))
			.resolves
			.not.toThrowError(AppError)
			expect(spyStorageDelete).toHaveBeenCalledTimes(1)
	})
})
