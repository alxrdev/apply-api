import { AppError } from '@errors/index'
import { ListJobsAppliedDTO } from '@modules/jobs/dtos'
import { Address, Job } from '@modules/jobs/entities'
import FakeJobRepository from '@modules/jobs/repositories/fake/FakeJobRepository'
import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { ListJobsAppliedUseCase } from '@modules/jobs/useCases'
import { User } from '@modules/users/entities'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'

const makeDto = (fields = {}) : ListJobsAppliedDTO => {
  const data = { id: '2', authId: '2', ...fields }
  return Object.assign(new ListJobsAppliedDTO(), data)
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

const makeSut = () : ListJobsAppliedUseCase => new ListJobsAppliedUseCase(jobRepository)

describe('Test the ListJobsAppliedUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(new User('1', 'employer', 'employer@email.com', 'employer', 'employer.jpg', 'password', '', '', ''))
    await userRepository.create(new User('2', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''))

    jobRepository = new FakeJobRepository(userRepository)
    await jobRepository.create(await makeJob('1'))
    await jobRepository.create(await makeJob('2'))
    await jobRepository.applyToJob('1', '2', 'resume.pdf')
    await jobRepository.applyToJob('2', '2', 'resume.pdf')
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const listJobsAppliedUseCase = makeSut()
    const dto = makeDto({ id: '', authId: '' })

    await expect(listJobsAppliedUseCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw an AppError when try to see applied jobs from another user', async () => {
    const listJobsAppliedUseCase = makeSut()
    const dto = makeDto({ id: '3' })

    await expect(listJobsAppliedUseCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should return a jobs applied array', async () => {
    const listJobsAppliedUseCase = makeSut()
    const spyFindAppliedJobs = jest.spyOn(jobRepository, 'findAppliedJobs')
    const dto = makeDto()

    const appliedJobs = await listJobsAppliedUseCase.execute(dto)

    expect(appliedJobs.length).toBe(2)
    expect(appliedJobs[0]).toBeInstanceOf(Job)
    expect(spyFindAppliedJobs).toHaveBeenCalled()
  })
})
