import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { inject, injectable } from 'tsyringe'

import { Job, CollectionResponse, FilesToDeleteCollection, FileToDelete, UserApplied } from '@modules/jobs/entities'
import { ListJobsFiltersDTO } from '@modules/jobs/dtos'

import { JobNotFoundError } from '@modules/jobs/errors'
import { UserNotFoundError } from '@modules/users/errors'
import { AppError } from '@errors/index'
import IUserRepository from '@modules/users/repositories/IUserRepository'

interface Applicant {
  job: Job
  userApplied: UserApplied
}

@injectable()
export default class FakeJobRepository implements IJobRepository {
  private jobs: Job[]
  private applicants: Applicant[]

  public constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {
    this.jobs = []
    this.applicants = []
  }

  public async findById (id: string): Promise<Job> {
    const job = this.jobs.find(j => j.id === id)

    if (!job) {
      throw new JobNotFoundError('Job not found.', false, 404)
    }

    return job
  }

  public async findAll (filters: ListJobsFiltersDTO): Promise<CollectionResponse<Job>> {
    const jobs = this.jobs.filter(job => {
      const whatRegex = new RegExp(filters.what, 'gi')
      const jobTypeRegex = new RegExp(filters.jobType, 'i')
      const locationRegex = new RegExp(filters.where, 'gi')

      const findTitle = () => {
        return whatRegex.test(job.title)
      }
      const findJobType = () => {
        if (filters.jobType === '') return true
        return jobTypeRegex.test(job.jobType.toString())
      }
      const findLocation = () => {
        if (filters.where === '') return true
        const city = locationRegex.test(job.address.city)
        const state = locationRegex.test(job.address.state)
        return (city) || state
      }

      return (findTitle() && findLocation() && findJobType())
    })

    return this.findCollection(jobs, filters.page, filters.limit, filters.sortBy, filters.sortOrder)
  }

  public async findAllByUserId (userId: string): Promise<Array<Job>> {
    const jobs = this.jobs.filter(job => job.user.id === userId)

    if (!jobs || jobs.length < 1) {
      return [] as Array<Job>
    }

    return jobs
  }

  public async findAppliedJobs (userId: string): Promise<Array<Job>> {
    const applicants = this.applicants.filter(applicant => applicant.userApplied.user.id === userId)

    return applicants.map(applicant => applicant.job)
  }

  public async findAllUsersAppliedToJob (id: string): Promise<Array<UserApplied>> {
    const applicants = this.applicants.filter(applicant => applicant.job.id === id)

    if (!applicants) {
      return [{}] as Array<UserApplied>
    }

    return applicants.map(applicant => applicant.userApplied)
  }

  public async findUserAppliedToJob (id: string, userId: string): Promise<UserApplied> {
    const applicant = this.applicants.find(applicant => applicant.job.id === id && applicant.userApplied.user.id === userId)

    if (!applicant) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    return applicant.userApplied
  }

  public async create (job: Job): Promise<Job> {
    this.jobs.push(job)
    return job
  }

  public async update (job: Job): Promise<Job> {
    const jobIndex = this.jobs.findIndex(j => j.id === job.id)
    this.jobs[jobIndex] = job
    return job
  }

  public async delete (id: string): Promise<FilesToDeleteCollection> {
    await this.findById(id)

    const usersApplied = await this.findAllUsersAppliedToJob(id)

    const files = usersApplied.map(userApplied => ({ file: userApplied.resume }))

    this.jobs = this.jobs.filter(j => j.id !== id)

    return {
      files: files
    }
  }

  public async applyToJob (jobId: string, userId: string, resume: string): Promise<void> {
    const job = await this.findById(jobId)
    const user = await this.userRepository.findById(userId)

    try {
      await this.findUserAppliedToJob(jobId, userId)
      throw new AppError('User already applied to this job.', false, 400)
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        this.applicants.push({ job, userApplied: { user, resume } })
      } else {
        throw err
      }
    }
  }

  public async removeApplyToJobs (userId: string): Promise<FilesToDeleteCollection> {
    const jobsApplied = await this.findAppliedJobs(userId)

    const files: Array<FileToDelete> = []

    jobsApplied.forEach(async (job) => {
      const userApplied = await this.findUserAppliedToJob(job.id, userId)

      files.push({ file: userApplied.resume })

      this.applicants = this.applicants.filter(a => a.job.id !== job.id && a.userApplied.user.id !== userId)
    })

    return {
      files: files
    }
  }

  private async findCollection (query: Job[], page: number, limit: number, sortBy: string, sortOrder: string): Promise<CollectionResponse<Job>> {
    const skip = (page - 1) * limit

    query = (sortBy === 'salary') ? query.sort((a, b) => Number(a.salary) - Number(b.salary)) : query

    query = (sortOrder === 'asc') ? query : query.reverse()

    const jobs = query.slice(skip, (limit + skip))

    return { count: query.length, collection: jobs }
  }
}
