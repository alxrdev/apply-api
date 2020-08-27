import { Address } from '.'

export default class Job {
  public id: string
  public userId: string
  public title: string
  public description: string
  public address: Address
  public jobType: string
  public workTime: string
  public workplace: string
  public featured: boolean
  public tags: string
  public salary: Number
  public lastDate: Date
  public createdAt: Date

  constructor (id: string, userId: string, title: string, description: string, address: Address, jobType: string, workTime: string, workplace: string, featured: boolean, tags: string, salary: number, lastDate: Date, createdAt: Date) {
    this.id = id
    this.userId = userId
    this.title = title
    this.description = description
    this.address = address
    this.jobType = jobType
    this.workTime = workTime
    this.workplace = workplace
    this.featured = featured
    this.tags = tags
    this.salary = salary
    this.lastDate = lastDate
    this.createdAt = createdAt
  }
}
