import { Address, Job } from "@modules/jobs/entities"
import { JobNotFoundError } from "@modules/jobs/errors"
import FakeJobRepository from "@modules/jobs/repositories/fake/FakeJobRepository"
import IJobRepository from "@modules/jobs/repositories/IJobRepository"
import { ShowJobUseCase } from "@modules/jobs/useCases"
import { User } from "@modules/users/entities"
import FakeUserRepository from "@modules/users/repositories/fake/FakeUserRepository"
import IUserRepository from "@modules/users/repositories/IUserRepository"

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

const makeSut = () : ShowJobUseCase => new ShowJobUseCase(jobRepository)

describe('Test the ShowJobUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
		await userRepository.create(new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))

    jobRepository = new FakeJobRepository(userRepository)
		await jobRepository.create(await makeJob('1'))
  })

  it('Should throw a JobNotFoundError when the job does not exists', async () => {
    const sut = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')

    await expect(sut.execute('2')).rejects.toThrowError(JobNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should return a job', async () => {
    const sut = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')

    const job = await sut.execute('1')

    expect(job).toBeInstanceOf(Job)
    expect(spyFindById).toHaveBeenCalled()
  })
})