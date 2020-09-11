import { Job, CollectionResponse, FilesToDeleteCollection, UserApplied } from '../entities'
import { ListJobsFiltersDTO } from '../dtos'

export default interface IJobRepository {
  findById (id: string): Promise<Job>
  findAll (options: ListJobsFiltersDTO): Promise<CollectionResponse<Job>>
  findAllByUserId (userId: string): Promise<Array<Job>>
  findAppliedJobs (userId: string): Promise<Array<Job>>
  findAllUsersAppliedToJob (id: string): Promise<Array<UserApplied>>
  findUserAppliedToJob (id: string, userId: string): Promise<UserApplied>
  create (job: Job): Promise<Job>
  update (job: Job): Promise<Job>
  delete (id: string): Promise<FilesToDeleteCollection>
  applyToJob(jobId: string, userId: string, resume: string): Promise<void>
  removeApplyToJobs (userId: string): Promise<FilesToDeleteCollection>
}
