import { AppError } from "@errors/index"
import { ListUsersAppliedDTO } from "@modules/jobs/dtos"
import { Address, Job, UserApplied } from "@modules/jobs/entities"
import { JobNotFoundError } from "@modules/jobs/errors"
import FakeJobRepository from "@modules/jobs/repositories/fake/FakeJobRepository"
import IJobRepository from "@modules/jobs/repositories/IJobRepository"
import { ListUsersAppliedUseCase } from "@modules/jobs/useCases"
import { User } from "@modules/users/entities"
import FakeUserRepository from "@modules/users/repositories/fake/FakeUserRepository"
import IUserRepository from "@modules/users/repositories/IUserRepository"

const makeDto = (fields = {}) : ListUsersAppliedDTO => {
  const data = { id: '1', authUserId: '1', ...fields }
  return Object.assign(new ListUsersAppliedDTO(), data)
}

const makeJob = async (id: string) : Promise<Job> => new Job(
  id, 
  await userRepository.findById('1'), 
  'First job', 
  'this is the first job', 
  new Address('ES', 'São Mateus'),
  'Full-time', 
  1200.00, 
  new Date()
)

let userRepository: IUserRepository
let jobRepository: IJobRepository

const makeSut = () : ListUsersAppliedUseCase => new ListUsersAppliedUseCase(jobRepository)

describe('Test the ListUsersAppliedUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
		await userRepository.create(new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))
		await userRepository.create(new User('2', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))
		await userRepository.create(new User('3', 'user', 'user3@email.com', 'user', 'user.jpg', 'password', '', '', ''))

    jobRepository = new FakeJobRepository(userRepository)
		await jobRepository.create(await makeJob('1'))
    await jobRepository.applyToJob('1', '2', 'resume.pdf')
    await jobRepository.applyToJob('1', '3', 'resume.pdf')
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const sut = makeSut()
    const dto = makeDto({ id: '', authUserId: '' })

    await expect(sut.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw a JobNotFoundError when the job does not exists', async () => {
    const sut = makeSut()
    const dto = makeDto({ id: '3' })

    await expect(sut.execute(dto)).rejects.toThrowError(JobNotFoundError)
  })

  it('Should throw an AppError when the user is not the job owner', async () => {
    const sut = makeSut()
    const dto = makeDto({ authUserId: '3' })

    await expect(sut.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should return a UserApplied list', async () => {
    const sut = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const dto = makeDto()

    const usersApplied = await sut.execute(dto)

    expect(usersApplied.length).toBe(2)
    expect(usersApplied[0]).toHaveProperty('user')
    expect(usersApplied[0]).toHaveProperty('resume')
    expect(spyFindById).toHaveBeenCalled()
  })
})