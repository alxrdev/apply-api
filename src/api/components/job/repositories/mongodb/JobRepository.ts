import IJobRepository from '../IJobRepository'
import Job from '../../entities/Job'
import jobModel, { IJob } from '../../../../../services/mongodb/schemas/job'
import Industry from '../../entities/Industry'
import JobType from '../../entities/JobTypes'
import Education from '../../entities/Education'
import Experience from '../../entities/Experience'
import JobNotFoundError from '../../errors/JobNotFoundError'
import ListJobsDTO from '../../dtos/ListJobsDTO'

export default class JobRepository implements IJobRepository {
  private jobModel: typeof jobModel

  constructor () {
    this.jobModel = jobModel
  }

  public async fetchById (id: string): Promise<Job> {
    const result = await this.jobModel.findOne({ _id: id })

    if (result === null) {
      throw new JobNotFoundError('Job not found.', false, 404)
    }

    return this.jobDocumentToJob(result)
  }

  public async fetchAll (options: ListJobsDTO): Promise<Array<Job>> {
    const results = await this.jobModel.find({
      title: { $regex: options.title, $options: 'i' },
      description: { $regex: options.description, $options: 'i' },
      company: { $regex: options.company, $options: 'i' },
      industry: { $in: options.industryRegex },
      jobType: { $regex: options.jobType, $options: 'i' },
      minEducation: { $regex: options.minEducation, $options: 'i' }
    })

    const jobs = results.map(job => this.jobDocumentToJob(job))

    return jobs
  }

  public async fetchByGeolocation (latitude: number, longitude: number, radius: number): Promise<Array<Job>> {
    const results = await this.jobModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            radius
          ]
        }
      }
    })

    const jobs = results.map(job => this.jobDocumentToJob(job))

    return jobs
  }

  public async create (job: Job): Promise<Job> {
    await this.jobModel.create(this.jobToJobDocument(job))
    return job
  }

  public async update (job: Job): Promise<Job> {
    await this.jobModel.updateOne({ _id: job.getId() }, this.jobToJobDocument(job))
    return job
  }

  public async delete (id: string): Promise<void> {
    await this.fetchById(id)
    await this.jobModel.deleteOne({ _id: id })
  }

  private jobDocumentToJob (jobDocument: IJob): Job {
    return new Job(
      jobDocument._id,
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
