import { AppError } from '@errors/index'
import { ApplyToJobDTO } from '@modules/jobs/dtos'
import { Address, Job } from '@modules/jobs/entities'
import { JobNotFoundError } from '@modules/jobs/errors'
import FakeJobRepository from '@modules/jobs/repositories/fake/FakeJobRepository'
import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { ApplyToJobUseCase } from '@modules/jobs/useCases'
import { User } from '@modules/users/entities'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import FakeStorageService from '@services/storage/FakeStorageService'
import IStorageService from '@services/storage/interfaces/IStorageService'

let userRepository: IUserRepository
let jobRepository: IJobRepository
let fakeStorage: IStorageService

const makeDto = (fields = {}) : ApplyToJobDTO => {
  const data = { id: '1', userId: '2', resume: 'resume.pdf', ...fields }
  return Object.assign(new ApplyToJobDTO(), data)
}

const makeSut = () : ApplyToJobUseCase => new ApplyToJobUseCase(jobRepository, fakeStorage)

describe('Test the ApplyToJobUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(User.builder()
      .withId('1')
      .withName('employer')
      .withEmail('employer@email.com')
      .withAvatar('employer.jpg')
      .withRole('employer')
      .withPassword('password')
      .build()
    )
    await userRepository.create(User.builder()
      .withId('2')
      .withName('John Doe')
      .withEmail('user@email.com')
      .withAvatar('avatar.jpg')
      .withPassword('password')
      .withHeadline('my headline')
      .build()
    )

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

    fakeStorage = new FakeStorageService()
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const applyToJobUseCase = makeSut()
    const dto = makeDto({ resume: '' })

    await expect(applyToJobUseCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw an JobNotFoundError when the job not exists', async () => {
    const applyToJobUseCase = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const dto = makeDto({ id: '3' })

    await expect(applyToJobUseCase.execute(dto)).rejects.toThrowError(JobNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should delete the uploaded resume when an error occurs', async () => {
    const applyToJobUseCase = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const spyApplyToJob = jest.spyOn(jobRepository, 'applyToJob')
    const spyStorageSave = jest.spyOn(fakeStorage, 'save')
    const spyStorageDelete = jest.spyOn(fakeStorage, 'delete')
    const dto = makeDto({ id: '3' })

    await expect(applyToJobUseCase.execute(dto)).rejects.toThrowError(JobNotFoundError)

    expect(spyFindById).toHaveBeenCalled()
    expect(spyApplyToJob).not.toHaveBeenCalled()
    expect(spyStorageSave).not.toHaveBeenCalled()
    expect(spyStorageDelete).toHaveBeenCalled()
  })

  it('Should store the uploaded resume', async () => {
    const applyToJobUseCase = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const spyApplyToJob = jest.spyOn(jobRepository, 'applyToJob')
    const spyStorageSave = jest.spyOn(fakeStorage, 'save')
    const dto = makeDto()

    await applyToJobUseCase.execute(dto)

    expect(spyFindById).toHaveBeenCalled()
    expect(spyApplyToJob).toHaveBeenCalled()
    expect(spyStorageSave).toHaveBeenCalled()
  })
})
