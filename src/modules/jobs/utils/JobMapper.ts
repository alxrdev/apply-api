import { Address, Job, JobResponse, UserApplied, UserAppliedResponse } from '../entities'
import UserMapper from '@modules/users/utils/UserMapper'
import { IJob } from '@providers/database/mongodb/schemas/job'
import { IUser } from '@providers/database/mongodb/schemas/user'

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
      resume: `https://holoscdh.com.br/wp-content/plugins/imageuploader/resume/${userApplied.resume}`
    }
  }

  public static fromUserAppliedArrayToUserAppliedResponseArray (usersApplied: Array<UserApplied>): Array<UserAppliedResponse> {
    const result = usersApplied.map(userApplied => JobMapper.fromUserAppliedToUserAppliedResponse(userApplied))
    return result
  }

  public static fromPersistenceToJob (job: IJob): Job {
    const user = job.user as IUser

    return Job.create({
      user: UserMapper.fromPersistenceToUser(user),
      title: job.title,
      description: job.description,
      address: new Address(job.address.state.toString(), job.address.city.toString()),
      jobType: job.jobType,
      salary: job.salary,
      createdAt: job.createdAt
    }, job._id)
  }

  public static fromJobToPersistence (job: Job) {
    return {
      _id: job.id,
      user: job.user.id,
      title: job.title,
      description: job.description,
      address: {
        state: job.address.state,
        city: job.address.city
      },
      jobType: job.jobType,
      salary: Number(job.salary),
      createdAt: job.createdAt
    }
  }
}
