import { AppError } from "@errors/index"
import { ListPublishedJobsByUserDTO } from "@modules/jobs/dtos"
import { Address, Job } from "@modules/jobs/entities"
import FakeJobRepository from "@modules/jobs/repositories/fake/FakeJobRepository"
import IJobRepository from "@modules/jobs/repositories/IJobRepository"
import { ListPublishedJobsByUserUseCase } from "@modules/jobs/useCases"
import { User } from "@modules/users/entities"
import FakeUserRepository from "@modules/users/repositories/fake/FakeUserRepository"
import IUserRepository from "@modules/users/repositories/IUserRepository"

const makeDto = (fields = {}) : ListPublishedJobsByUserDTO => {
  const data = { id: '1', ...fields }
  return Object.assign(new ListPublishedJobsByUserDTO(), data)
}

const makeJob = async (id: string) : Promise<Job> => new Job(
  id, 
  await userRepository.findById('1'), 
  'Developer', 
  'this is the first job', 
  new Address('ES', 'São Mateus'),
  'Full-time', 
  1200.00, 
  new Date()
)

let userRepository: IUserRepository
let jobRepository: IJobRepository

const makeSut = () : ListPublishedJobsByUserUseCase => new ListPublishedJobsByUserUseCase(jobRepository)

describe('Test the ListPublishedJobsByUserUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
		await userRepository.create(new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))
		await userRepository.create(new User('2', 'employer', 'employer2@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))

    jobRepository = new FakeJobRepository(userRepository)
		await jobRepository.create(await makeJob('1'))
		await jobRepository.create(await makeJob('2'))
		await jobRepository.create(await makeJob('3'))
		await jobRepository.create(await makeJob('4'))
		await jobRepository.create(await makeJob('5'))
  })

  it('Should throw an AppError when the user id is not provided', async () => {
    const sut = makeSut()
    const dto = makeDto({ id: '' })

    await expect(sut.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should return a list of published jobs', async () => {
    const sut = makeSut()
    const spyFindAllByUserId = jest.spyOn(jobRepository, 'findAllByUserId')
    const dto = makeDto()

    const jobs = await sut.execute(dto)

    expect(jobs.length).toBe(5)
    expect(jobs[0]).toBeInstanceOf(Job)
    expect(spyFindAllByUserId).toHaveBeenCalled()
  })

  it('Should return a empty list of jobs', async () => {
    const sut = makeSut()
    const spyFindAllByUserId = jest.spyOn(jobRepository, 'findAllByUserId')
    const dto = makeDto({ id: '2' })

    const jobs = await sut.execute(dto)

    expect(jobs.length).toBe(0)
    expect(spyFindAllByUserId).toHaveBeenCalled()
  })
})