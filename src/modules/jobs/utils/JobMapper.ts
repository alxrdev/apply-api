import { Job, JobResponse, UserApplied, UserAppliedResponse } from '../entities'
import UserMapper from '../../users/utils/UserMapper'
import { host } from '../../../configs/base'

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

  public static fromUserAppliedToUserAppliedResponse (userApplied: UserApplied): UserAppliedResponse {
    return {
      user: UserMapper.fromUserToUserResponse(userApplied.user),
      resume: `${host}/api/resume/${userApplied.resume}`
    }
  }

  public static fromUserAppliedArrayToUserAppliedResponseArray (usersApplied: Array<UserApplied>): Array<UserAppliedResponse> {
    const result = usersApplied.map(userApplied => JobMapper.fromUserAppliedToUserAppliedResponse(userApplied))
    return result
  }
}
