import { User } from '@src/modules/users/entities'
import { Address, Job } from '@src/modules/jobs/entities'

export default class JobBuilder {
  private id?: string = undefined
  private user!: User
  private title: string = 'My job'
  private description: string = 'My job description'
  private address: Address = { state: 'ES', city: 'São Mateus' }
  private jobType: string = 'Full-time'
  private salary: number = 1000
  private createdAt: Date = new Date(Date.now())

  public withId (id: string) {
    this.id = id
    return this
  }

  public withUser (user: User) {
    this.user = user
    return this
  }

  public withTitle (title: string) {
    this.title = title
    return this
  }

  public withDescription (description: string) {
    this.description = description
    return this
  }

  public withAddress (address: Address) {
    this.address = address
    return this
  }

  public withJobType (jobType: string) {
    this.jobType = jobType
    return this
  }

  public withSalary (salary: number) {
    this.salary = salary
    return this
  }

  public withCreatedAt (createdAt: Date) {
    this.createdAt = createdAt
    return this
  }

  public build () : Job {
    return Job.create({
      user: this.user,
      title: this.title,
      description: this.description,
      address: this.address,
      jobType: this.jobType,
      salary: this.salary,
      createdAt: this.createdAt
    }, this.id)
  }
}
