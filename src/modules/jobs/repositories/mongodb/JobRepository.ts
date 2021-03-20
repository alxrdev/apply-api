import { MongooseFilterQuery } from 'mongoose'

import IJobRepository from '../IJobRepository'
import jobModel, { IJob } from '../../../../services/database/mongodb/schemas/job'
import UserRepository from '../../../users/repositories/mongodb/UserRepository'
import { IUser } from '../../../../services/database/mongodb/schemas/user'
import { Job, FilesToDeleteCollection, FileToDelete, Address, UserApplied } from '../../entities'
import { CollectionResponse } from '@src/modules/shared/entities'
import { ListJobsFiltersDTO } from '../../dtos'

import { JobNotFoundError } from '../../errors'
import { UserNotFoundError } from '../../../users/errors'
import { AppError } from '../../../../errors'

export default class JobRepository implements IJobRepository {
  public async findById (id: string): Promise<Job> {
    const result = await jobModel.findOne({ _id: id }).populate('user')

    if (result === null) {
      throw new JobNotFoundError('Job not found.', false, 404)
    }

    return this.jobDocumentToJob(result)
  }

  public async findAll (filters: ListJobsFiltersDTO): Promise<CollectionResponse<Job>> {
    const query: MongooseFilterQuery<IJob> = {
      title: { $regex: filters.what, $options: 'i' },
      jobType: { $regex: filters.jobType, $options: 'i' },
      $and: [{
        $or: [
          { 'address.state': { $regex: filters.where, $options: 'i' } },
          { 'address.city': { $regex: filters.where, $options: 'i' } }
        ]
      }]
    }

    return await this.findCollection(query, filters.page, filters.limit, filters.sortBy, filters.sortOrder)
  }

  public async findAllByUserId (userId: string): Promise<Array<Job>> {
    const result = await jobModel.find({ user: userId }).populate('user')
    return result.map(job => this.jobDocumentToJob(job))
  }

  public async findAppliedJobs (userId: string): Promise<Array<Job>> {
    const result = await jobModel.find({ 'applicantsApplied.user': userId }).populate('user')
    return result.map(job => this.jobDocumentToJob(job))
  }

  public async findAllUsersAppliedToJob (id: string): Promise<Array<UserApplied>> {
    const result = await jobModel.findOne({ _id: id })
      .select('+applicantsApplied')
      .populate({
        path: 'applicantsApplied.user',
        model: 'User'
      })

    if (result === null) {
      throw new JobNotFoundError('Job not found.', false, 404)
    }

    if (!result.applicantsApplied) {
      return [{}] as Array<UserApplied>
    }

    const usersApplied: Array<UserApplied> = result.applicantsApplied?.map(applicant => {
      const user = applicant.user as IUser
      const userApplied = UserRepository.userDocumentToUser(user)
      return { user: userApplied, resume: applicant.resume }
    })

    return usersApplied
  }

  public async findUserAppliedToJob (id: string, userId: string): Promise<UserApplied> {
    const result = await jobModel.findOne({ _id: id, 'applicantsApplied.user': userId })
      .select('+applicantsApplied')
      .populate({
        path: 'applicantsApplied.user',
        model: 'User'
      })

    if (result === null) {
      throw new JobNotFoundError('Job or user not found.', false, 404)
    }

    if (!result.applicantsApplied) {
      throw new UserNotFoundError('User not found.', false, 404)
    }

    const userIndex = result.applicantsApplied.findIndex(user => {
      const currentUser = user.user as IUser
      return (currentUser._id === userId)
    })

    const data = result.applicantsApplied[userIndex]

    return {
      user: UserRepository.userDocumentToUser(data.user as IUser),
      resume: data.resume
    }
  }

  public async create (job: Job): Promise<Job> {
    await jobModel.create(this.jobToJobDocument(job))
    return job
  }

  public async update (job: Job): Promise<Job> {
    await jobModel.updateOne({ _id: job.id }, this.jobToJobDocument(job))
    return job
  }

  public async delete (id: string): Promise<FilesToDeleteCollection> {
    const job = await jobModel.findOne({ _id: id }).select('+applicantsApplied')

    if (!job) {
      throw new JobNotFoundError('Job not found.', false, 404)
    }

    const files = job?.applicantsApplied?.map(user => ({ file: user.resume }))

    await job.remove()

    return {
      files: files
    }
  }

  public async applyToJob (jobId: string, userId: string, resume: string): Promise<void> {
    const job = await jobModel.findOne({ _id: jobId }).select('+applicantsApplied')

    if (!job) {
      throw new JobNotFoundError('Job not found.', false, 404)
    }

    if (job.applicantsApplied) {
      job.applicantsApplied.forEach(user => {
        if (user.user === userId) {
          throw new AppError('User already applied to this job.', false, 400)
        }
      })

      job.applicantsApplied.push({
        user: userId,
        resume: resume
      })
    } else {
      job.applicantsApplied = [{
        user: userId,
        resume: resume
      }]
    }

    await job.save()
  }

  public async removeApplyToJobs (userId: string): Promise<FilesToDeleteCollection> {
    const jobsApplied = await jobModel.find({ 'applicantsApplied.user': userId }).select('+applicantsApplied')

    const files: Array<FileToDelete> = []

    for (const job of jobsApplied) {
      job.applicantsApplied = job.applicantsApplied?.filter(user => {
        if (user.user === userId) {
          files.push({ file: user.resume })
        } else {
          return true
        }
      })

      await job.save()
    }

    return {
      files: files
    }
  }

  private async findCollection (query: MongooseFilterQuery<IJob>, page: number, limit: number, sortBy: string, sortOrder: string): Promise<CollectionResponse<Job>> {
    const skip = (page - 1) * limit

    sortOrder = (sortOrder === 'asc') ? '' : '-'

    const countResult = await jobModel.find(query).countDocuments()
    const jobsResult = await jobModel.find(query).populate('user').sort(`${sortOrder}${sortBy}`).skip(skip).limit(limit)

    const jobs = jobsResult.map(job => this.jobDocumentToJob(job))

    return { count: countResult, collection: jobs }
  }

  private jobDocumentToJob (jobDocument: IJob): Job {
    const user = jobDocument.user as IUser

    return new Job(
      jobDocument._id,
      UserRepository.userDocumentToUser(user),
      jobDocument.title,
      jobDocument.description,
      new Address(
        jobDocument.address.state.toString(),
        jobDocument.address.city.toString()
      ),
      jobDocument.jobType,
      jobDocument.salary,
      jobDocument.createdAt
    )
  }

  private jobToJobDocument (job: Job) {
    return {
      _id: job.id,
      user: job.user.id,
      title: job.title,
      description: job.description,
      address: {
        state: job.address.state,
        city: job.address.city
      },
      jobType: job.jobType.toString(),
      salary: Number(job.salary),
      createdAt: job.createdAt
    }
  }
}
