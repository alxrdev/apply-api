import { AppError } from '@errors/index'
import { DeleteJobDTO } from '@modules/jobs/dtos'
import { Address, Job } from '@modules/jobs/entities'
import { JobNotFoundError } from '@modules/jobs/errors'
import FakeJobRepository from '@modules/jobs/repositories/fake/FakeJobRepository'
import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { DeleteJobUseCase } from '@modules/jobs/useCases'
import { User } from '@modules/users/entities'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import FakeStorageService from '@services/storage/FakeStorageService'
import IStorageService from '@services/storage/interfaces/IStorageService'

let userRepository: IUserRepository
let jobRepository: IJobRepository
let fakeStorage: IStorageService

const makeDto = (fields = {}) : DeleteJobDTO => {
  const data = { id: '1', authId: '1', ...fields }
  return Object.assign(new DeleteJobDTO(), data)
}

const makeSut = () : DeleteJobUseCase => new DeleteJobUseCase(jobRepository, fakeStorage)

describe('Test the DeleteJoUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))
    await userRepository.create(new User('2', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

    jobRepository = new FakeJobRepository(userRepository)
    const job = new Job(
      '1',
      await userRepository.findById('1'),
      'First job',
      'this is the first job',
      new Address('ES', 'São Mateus'),
      'Full-time',
      1200.00,
      new Date()
    )
    await jobRepository.create(job)
    await jobRepository.applyToJob('1', '2', 'resume.pdf')

    fakeStorage = new FakeStorageService()
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const deleteJobUserCase = makeSut()
    const dto = makeDto({ id: '', authId: '' })

    await expect(deleteJobUserCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw a JobNotFoundError when the job does not exists', async () => {
    const deleteJobUserCase = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const dto = makeDto({ id: '3' })

    await expect(deleteJobUserCase.execute(dto)).rejects.toThrowError(JobNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should throw an AppError when the authenticated user is not the job owner', async () => {
    const deleteJobUserCase = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const dto = makeDto({ authId: '3' })

    await expect(deleteJobUserCase.execute(dto)).rejects.toThrowError(AppError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should delete the job and its files', async () => {
    const deleteJobUserCase = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const spyDelete = jest.spyOn(jobRepository, 'delete')
    const spyStorageDelete = jest.spyOn(fakeStorage, 'delete')
    const dto = makeDto()

    await deleteJobUserCase.execute(dto)

    expect(spyFindById).toHaveBeenCalled()
    expect(spyDelete).toHaveBeenCalled()
    expect(spyStorageDelete).toHaveBeenCalled()
  })
})
