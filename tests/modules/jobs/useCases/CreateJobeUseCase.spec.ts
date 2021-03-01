import { AppError } from '@errors/index'
import { CreateJobDTO } from '@modules/jobs/dtos'
import { Job } from '@modules/jobs/entities'
import FakeJobRepository from '@modules/jobs/repositories/fake/FakeJobRepository'
import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { CreateJobUseCase } from '@modules/jobs/useCases'
import { User } from '@modules/users/entities'
import { UserNotFoundError } from '@modules/users/errors'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'

const makeDto = (fields = {}) : CreateJobDTO => {
  const data = { userId: '1', title: 'My first job', description: 'this is my first job', salary: 1200.00, jobType: 'Full-time', state: 'ES', city: 'São Mateus', ...fields }
  const dto = new CreateJobDTO()
  return Object.assign(dto, data)
}

let userRepository: IUserRepository
let jobRepository: IJobRepository

const makeSut = () : CreateJobUseCase => new CreateJobUseCase(jobRepository, userRepository)

describe('Test the CreateJobUseCase class', () => {
  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    userRepository.create(new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))

    jobRepository = new FakeJobRepository(userRepository)
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const createJobUseCase = makeSut()
    const dto = makeDto({ title: '' })

    await expect(createJobUseCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw an AppError when invalid field is provided', async () => {
    const createJobUseCase = makeSut()
    const dto = makeDto({ jobType: 'invalid' })

    await expect(createJobUseCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw an UserNotFoundError when the user not exists', async () => {
    const createJobUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const dto = makeDto({ userId: '2' })

    await expect(createJobUseCase.execute(dto)).rejects.toThrowError(UserNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should return the created job', async () => {
    const createJobUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const spyCreate = jest.spyOn(jobRepository, 'create')
    const dto = makeDto()

    const job = await createJobUseCase.execute(dto)

    expect(job).toBeInstanceOf(Job)
    expect(job.title).toBe(dto.title)
    expect(job.description).toBe(dto.description)
    expect(job.salary).toBe(dto.salary)
    expect(job.jobType).toBe(dto.jobType)
    expect(job.address.state).toBe(dto.state)
    expect(job.address.city).toBe(dto.city)
    expect(spyFindById).toHaveBeenCalled()
    expect(spyCreate).toHaveBeenCalled()
  })
})
