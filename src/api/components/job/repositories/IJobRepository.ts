import Job from '../entities/Job'

export default interface IJobRepository {
  fetchById (id: string): Promise<Job>
  fetchAll (): Promise<Array<Job>>
  fetchByGeolocation (latitude: number, logitude: number, distance: number): Promise<Array<Job>>
  create (job: Job): Promise<Job>
  update (job: Job): Promise<Job>
  delete (id: string): Promise<void>
}
