import { AppError } from '@errors/index'
import { ShowUserAppliedDTO } from '@modules/jobs/dtos'
import { Address, Job } from '@modules/jobs/entities'
import { JobNotFoundError } from '@modules/jobs/errors'
import FakeJobRepository from '@modules/jobs/repositories/fake/FakeJobRepository'
import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { ShowUserAppliedUseCase } from '@modules/jobs/useCases'
import { User } from '@modules/users/entities'
import { UserNotFoundError } from '@modules/users/errors'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'

const makeDto = (fields = {}) : ShowUserAppliedDTO => {
  const data = { id: '1', authUserId: '2', userId: '2', ...fields }
  return Object.assign(new ShowUserAppliedDTO(), data)
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

const makeSut = () : ShowUserAppliedUseCase => new ShowUserAppliedUseCase(jobRepository)

describe('Test the ShowUserAppliedUseCase', () => {
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
    await jobRepository.applyToJob('1', '2', 'resume.pdf')
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const sut = makeSut()
    const dto = makeDto({ id: '', userId: '' })

    await expect(sut.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw a JobNotFoundError when the job does not exists', async () => {
    const sut = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const dto = makeDto({ id: '2' })

    await expect(sut.execute(dto)).rejects.toThrowError(JobNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should throw an AppError when the user applied is not the authenticated user', async () => {
    const sut = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const dto = makeDto({ authUserId: '3' })

    await expect(sut.execute(dto)).rejects.toThrowError(AppError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should throw an UserNotFoundError when the user is not applied to the job', async () => {
    const sut = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const spyFindUserAppliedToJob = jest.spyOn(jobRepository, 'findUserAppliedToJob')
    const dto = makeDto({ authUserId: '3', userId: '3' })

    await expect(sut.execute(dto)).rejects.toThrowError(UserNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
    expect(spyFindUserAppliedToJob).toHaveBeenCalled()
  })

  it('Should return the applied user', async () => {
    const sut = makeSut()
    const spyFindById = jest.spyOn(jobRepository, 'findById')
    const spyFindUserAppliedToJob = jest.spyOn(jobRepository, 'findUserAppliedToJob')
    const dto = makeDto()

    const user = await sut.execute(dto)

    expect(user).toHaveProperty('user')
    expect(user).toHaveProperty('resume')
    expect(spyFindById).toHaveBeenCalled()
    expect(spyFindUserAppliedToJob).toHaveBeenCalled()
  })
})
