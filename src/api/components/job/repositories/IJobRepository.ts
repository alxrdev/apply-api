import Job from '../entities/Job'

export default interface IJobRepository {
  fetch (): Promise<Array<Job>>
  fetchByGeolocation (latitude: number, logitude: number, distance: number): Promise<Array<Job>>
  store (job: Job): Promise<Job>
}
