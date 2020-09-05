import { Address } from '.'
import { User } from '../../users/entities'

export default class Job {
  public id: string
  public user: User
  public title: string
  public description: string
  public address: Address
  public jobType: String
  public salary: Number
  public createdAt: Date

  constructor (id: string, user: User, title: string, description: string, address: Address, jobType: string, salary: number, createdAt: Date) {
    this.id = id
    this.user = user
    this.title = title
    this.description = description
    this.address = address
    this.jobType = jobType
    this.salary = salary
    this.createdAt = createdAt
  }
}
