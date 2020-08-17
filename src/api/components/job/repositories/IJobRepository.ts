import Job from '../entities/Job'

export default interface IJobRepository {
  fetch (): Promise<Array<Job>>
  store (job: Job): Promise<Job>
}
