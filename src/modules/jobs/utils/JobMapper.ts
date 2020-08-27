import { Job, JobResponse } from '../entities'

export default class JobMapper {
  public static fromJobToJobResponse (job: Job): JobResponse {
    return {
      id: job.id,
      userId: job.userId,
      title: job.title,
      description: job.description,
      address: {
        country: job.address.country,
        city: job.address.city
      },
      jobType: job.jobType,
      workTime: job.workTime,
      workplace: job.workplace,
      featured: job.featured,
      tags: job.tags,
      salary: Number(job.salary),
      lastDate: job.lastDate,
      createdAt: job.createdAt
    }
  }

  public static fromJobArrayToJobResponseArray (jobs: Array<Job>): Array<JobResponse> {
    const result = jobs.map(job => JobMapper.fromJobToJobResponse(job))
    return result
  }
}
