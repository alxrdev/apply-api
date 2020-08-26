import IJobRepository from '../IJobRepository'
import Job from '../../entities/Job'
import jobModel, { IJob } from '../../../../../services/mongodb/schemas/job'
import Industry from '../../entities/Industry'
import JobType from '../../entities/JobTypes'
import Education from '../../entities/Education'
import Experience from '../../entities/Experience'
import JobNotFoundError from '../../errors/JobNotFoundError'
import ListJobsFiltersDTO from '../../dtos/ListJobsFiltersDTO'
import CollectionResponse from '../../entities/CollectionResponse'
import { MongooseFilterQuery } from 'mongoose'
import FindJobsByGeolocationFiltersDTO from '../../dtos/FindJobsByGeolocationFiltersDTO'
import AppError from '../../../../../errors/AppError'
import FilesToDeleteCollection from '../../entities/FilesToDeleteCollection'
import FileToDelete from '../../entities/FileToDelete'

export default class JobRepository implements IJobRepository {
  public async findById (id: string): Promise<Job> {
    const result = await jobModel.findOne({ _id: id })

    if (result === null) {
      throw new JobNotFoundError('Job not found.', false, 404)
    }

    return this.jobDocumentToJob(result)
  }

  public async findAll (filters: ListJobsFiltersDTO): Promise<CollectionResponse<Job>> {
    const query: MongooseFilterQuery<IJob> = {
      title: { $regex: filters.title, $options: 'i' },
      description: { $regex: filters.description, $options: 'i' },
      company: { $regex: filters.company, $options: 'i' },
      industry: { $in: filters.industryRegex },
      jobType: { $regex: filters.jobType, $options: 'i' },
      minEducation: { $regex: filters.minEducation, $options: 'i' }
    }

    return await this.findCollection(query, filters.page, filters.limit, filters.sortBy, filters.sortOrder)
  }

  public async findByGeolocation (latitude: number, longitude: number, radius: number, filters: FindJobsByGeolocationFiltersDTO): Promise<CollectionResponse<Job>> {
    const query: MongooseFilterQuery<IJob> = {
      title: { $regex: filters.title, $options: 'i' },
      description: { $regex: filters.description, $options: 'i' },
      company: { $regex: filters.company, $options: 'i' },
      industry: { $in: filters.industryRegex },
      jobType: { $regex: filters.jobType, $options: 'i' },
      minEducation: { $regex: filters.minEducation, $options: 'i' },
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            radius
          ]
        }
      }
    }

    return await this.findCollection(query, filters.page, filters.limit, filters.sortBy, filters.sortOrder)
  }

  public async findAppliedJobs (userId: string): Promise<Array<Job>> {
    const result = await jobModel.find({ 'applicantsApplied.id': userId })
    return result.map(job => this.jobDocumentToJob(job))
  }

  public async create (job: Job): Promise<Job> {
    await jobModel.create(this.jobToJobDocument(job))
    return job
  }

  public async update (job: Job): Promise<Job> {
    await jobModel.updateOne({ _id: job.getId() }, this.jobToJobDocument(job))
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
        if (user.id === userId) {
          throw new AppError('User already applied to this job.', false, 400)
        }
      })

      job.applicantsApplied.push({
        id: userId,
        resume: resume
      })
    } else {
      job.applicantsApplied = [{
        id: userId,
        resume: resume
      }]
    }

    await job.save()
  }

  public async removeApplyToJobs (userId: string): Promise<FilesToDeleteCollection> {
    const jobsApplyed = await jobModel.find({ 'applicantsApplied.id': userId }).select('+applicantsApplied')

    const files: Array<FileToDelete> = []

    for (const job of jobsApplyed) {
      job.applicantsApplied = job.applicantsApplied?.filter(user => {
        if (user.id === userId) {
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
    const jobsResult = await jobModel.find(query).sort(`${sortOrder}${sortBy}`).skip(skip).limit(limit)

    const jobs = jobsResult.map(job => this.jobDocumentToJob(job))

    return { count: countResult, collection: jobs }
  }

  private jobDocumentToJob (jobDocument: IJob): Job {
    return new Job(
      jobDocument._id,
      jobDocument.user,
      jobDocument.title,
      jobDocument.slug,
      jobDocument.description,
      jobDocument.email,
      jobDocument.address,
      jobDocument.company,
      new Industry(jobDocument.industry),
      new JobType(jobDocument.jobType),
      new Education(jobDocument.minEducation),
      new Experience(jobDocument.experience),
      jobDocument.salary,
      jobDocument.position,
      jobDocument.postingDate,
      jobDocument.lastDate
    )
  }

  private jobToJobDocument (job: Job) {
    return {
      _id: job.getId(),
      user: job.getUserId(),
      title: job.getTitle(),
      description: job.getDescription(),
      slug: job.getSlug(),
      email: job.getEmail(),
      address: job.getAddress(),
      company: job.getCompany(),
      industry: job.getIndustry(),
      jobType: job.getJobType(),
      minEducation: job.getMinEducation(),
      position: job.getPosition(),
      experience: job.getExperience(),
      salary: job.getSalary(),
      postingDate: job.getPostingDate(),
      lastDate: job.getLastDate()
    }
  }
}
