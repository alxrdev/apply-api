import { AppError } from '@errors/index'
import { UpdateJobDTO } from '@modules/jobs/dtos'
import { Address, Job } from '@modules/jobs/entities'
import { JobNotFoundError } from '@modules/jobs/errors'
import FakeJobRepository from '@modules/jobs/repositories/fake/FakeJobRepository'
import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { UpdateJobUseCase } from '@modules/jobs/useCases'
import { User } from '@modules/users/entities'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'

const makeDto = (fields = {}) : UpdateJobDTO => {
  const data = { id: '1', authId: '1', title: 'updated', description: 'updated', salary: 1200.00, jobType: 'Full-time', state: 'ES', city: 'São Mateus', ...fields }
  return Object.assign(new UpdateJobDTO(), data)
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

const makeSut = () : UpdateJobUseCase => new UpdateJobUseCase(jobRepository)

describe('Test the UpdateJobUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(User.builder()
      .withId('1')
      .withName('John Doe')
      .withEmail('user@email.com')
      .withRole('employer')
      .withAvatar('avatar.jpg')
      .withPassword('password')
      .withHeadline('my headline')
      .build()
    )
    await userRepository.create(User.builder()
      .withId('2')
      .withName('John Doe')
      .withEmail('user2@email.com')
      .withAvatar('avatar.jpg')
      .withPassword('password')
      .withHeadline('my headline')
      .build()
    )

    jobRepository = new FakeJobRepository(userRepository)
    await jobRepository.create(await makeJob('1'))
  })

  it('Should throw an AppError when an invalid field is provided', async () => {
    const sut = makeSut()
    const dto = makeDto({ title: '', jobType: 'invalid', state: '' })

    await expect(sut.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw a JobNotFoundError when the job does not exists', async () => {
    const sut = makeSut()
    const dto = makeDto({ id: '2' })
    const spyFindById = jest.spyOn(jobRepository, 'findById')

    await expect(sut.execute(dto)).rejects.toThrowError(JobNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should throw an AppError when authenticated user is not the job owner', async () => {
    const sut = makeSut()
    const dto = makeDto({ authId: '2' })
    const spyFindById = jest.spyOn(jobRepository, 'findById')

    await expect(sut.execute(dto)).rejects.toThrowError(AppError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should update the job', async () => {
    const sut = makeSut()
    const dto = makeDto()
    const spyFindById = jest.spyOn(jobRepository, 'findById')

    const job = await sut.execute(dto)

    expect(job).toBeInstanceOf(Job)
    expect(job.title).toBe('updated')
    expect(job.description).toBe('updated')
    expect(spyFindById).toHaveBeenCalled()
  })
})
