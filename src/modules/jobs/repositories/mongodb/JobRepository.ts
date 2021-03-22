import { MongooseFilterQuery } from 'mongoose'

import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import jobModel, { IJob } from '@providers/database/mongodb/schemas/job'
import { IUser } from '@providers/database/mongodb/schemas/user'
import { Job, FilesToDeleteCollection, FileToDelete, UserApplied } from '@modules/jobs/entities'
import { CollectionResponse } from '@modules/shared/entities'
import { ListJobsFiltersDTO } from '@modules/jobs/dtos'

import { JobNotFoundError } from '@modules/jobs/errors'
import { UserNotFoundError } from '@modules/users/errors'
import UserMapper from '@modules/users/utils/UserMapper'
import JobMapper from '@modules/jobs/utils/JobMapper'
import { AppError } from '@errors/index'

export default class JobRepository implements IJobRepository {
  public async findById (id: string): Promise<Job> {
    const result = await jobModel.findOne({ _id: id }).populate('user')

    if (result === null) {
      throw new JobNotFoundError('Job not found.', false, 404)
    }

    return JobMapper.fromPersistenceToJob(result)
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
    return result.map(job => JobMapper.fromPersistenceToJob(job))
  }

  public async findAppliedJobs (userId: string): Promise<Array<Job>> {
    const result = await jobModel.find({ 'applicantsApplied.user': userId }).populate('user')
    return result.map(job => JobMapper.fromPersistenceToJob(job))
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
      const userApplied = UserMapper.fromPersistenceToUser(user)
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
      user: UserMapper.fromPersistenceToUser(data.user as IUser),
      resume: data.resume
    }
  }

  public async create (job: Job): Promise<Job> {
    await jobModel.create(JobMapper.fromJobToPersistence(job))
    return job
  }

  public async update (job: Job): Promise<Job> {
    await jobModel.updateOne({ _id: job.id }, JobMapper.fromJobToPersistence(job))
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

    const jobs = jobsResult.map(job => JobMapper.fromPersistenceToJob(job))

    return { count: countResult, collection: jobs }
  }
}
