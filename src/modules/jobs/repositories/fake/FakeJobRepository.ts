import IJobRepository from '@modules/jobs/repositories/IJobRepository'
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

export default class FakeJobRepository implements IJobRepository {
  private jobs: Job[]
  private applicants: Applicant[]

  public constructor(private readonly userRepository: IUserRepository) {
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
    // const query: MongooseFilterQuery<IJob> = {
    //   title: { $regex: filters.what, $options: 'i' },
    //   jobType: { $regex: filters.jobType, $options: 'i' },
    //   $and: [{
    //     $or: [
    //       { 'address.state': { $regex: filters.where, $options: 'i' } },
    //       { 'address.city': { $regex: filters.where, $options: 'i' } }
    //     ]
    //   }]
    // }

    // const jobs = this.jobs.filter(job => {
    //   //
    // })

    return { count: this.jobs.length, collection: this.jobs }
  }

  public async findAllByUserId (userId: string): Promise<Array<Job>> {
    const jobs = this.jobs.filter(job => job.user.id === userId)

    if (!jobs || jobs.length < 1) {
      throw new JobNotFoundError('User not found.', false, 404)
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
    const job = await this.findById(id)

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

  // private async findCollection (query: Job[], page: number, limit: number, sortBy: string, sortOrder: string): Promise<CollectionResponse<Job>> {
  //   const skip = (page - 1) * limit

  //   sortOrder = (sortOrder === 'asc') ? '' : '-'

  //   const countResult = query.length
  //   const jobsResult = query.sort((a, b) => {
  //     switch (sortBy) {
  //       case 'title':
  //         const sorted = a.title.localeCompare(b.title)
  //         return (sortOrder === 'asc') ? sorted : sorted.
  //     }
  //   })
  //   // const jobsResult = await jobModel.find(query).populate('user').sort(`${sortOrder}${sortBy}`).skip(skip).limit(limit)

  //   const jobs = jobsResult.map(job => this.jobDocumentToJob(job))

  //   return { count: countResult, collection: jobs }
  // }
}
