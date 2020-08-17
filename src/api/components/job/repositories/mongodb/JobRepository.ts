import IJobRepository from '../IJobRepository'
import Job from '../../entities/Job'
import jobModel from '../../../../../services/mongodb/schemas/job'
import Industry from '../../entities/Industry'
import JobType from '../../entities/JobTypes'
import Education from '../../entities/Education'
import Experience from '../../entities/Experience'

export default class JobRepository implements IJobRepository {
  private jobModel: typeof jobModel

  constructor () {
    this.jobModel = jobModel
  }

  public async fetch (): Promise<Array<Job>> {
    const results = await this.jobModel.find()

    const jobs = results.map(job => {
      return new Job(
        job._id,
        job.title,
        job.slug,
        job.description,
        job.email,
        job.address,
        job.company,
        new Industry(job.industry),
        new JobType(job.jobType),
        new Education(job.minEducation),
        new Experience(job.experience),
        job.salary,
        job.position,
        job.postingDate,
        job.lastDate
      )
    })

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

    const jobs = results.map(job => {
      return new Job(
        job._id,
        job.title,
        job.slug,
        job.description,
        job.email,
        job.address,
        job.company,
        new Industry(job.industry),
        new JobType(job.jobType),
        new Education(job.minEducation),
        new Experience(job.experience),
        job.salary,
        job.position,
        job.postingDate,
        job.lastDate
      )
    })

    return jobs
  }

  public async store (job: Job): Promise<Job> {
    await this.jobModel.create({
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
    })

    return job
  }
}
