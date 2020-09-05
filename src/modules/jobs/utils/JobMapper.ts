import { Job, JobResponse } from '../entities'
import UserMapper from '../../users/utils/UserMapper'

export default class JobMapper {
  public static fromJobToJobResponse (job: Job): JobResponse {
    return {
      id: job.id,
      user: UserMapper.fromUserToUserResponse(job.user),
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

  public static fromJobArrayToJobResponseArray (jobs: Array<Job>): Array<JobResponse> {
    const result = jobs.map(job => JobMapper.fromJobToJobResponse(job))
    return result
  }
}
