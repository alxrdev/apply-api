import Industry from './Industry'
import JobType from './JobTypes'
import Education from './Education'
import Experience from './Experience'

export default class Job {
  private id: string
  private userId: string
  private title: string
  private slug: string
  private description: string
  private email: string
  private address: string
  private company: string
  private industry: Industry
  private jobType: JobType
  private minEducation: Education
  private experience: Experience
  private salary: Number
  private position: Number
  private postingDate: Date
  private lastDate: Date

  constructor (id: string, userId: string, title: string, slug: string, description: string, email: string, address: string, company: string, industry: Industry, jobType: JobType, minEducation: Education, experience: Experience, salary: Number, position: Number, postingDate: Date, lastDate: Date) {
    this.id = id
    this.userId = userId
    this.title = title
    this.slug = slug
    this.description = description
    this.email = email
    this.address = address
    this.company = company
    this.industry = industry
    this.jobType = jobType
    this.minEducation = minEducation
    this.position = position
    this.experience = experience
    this.salary = salary
    this.postingDate = postingDate
    this.lastDate = lastDate
  }

  public getId (): string {
    return this.id
  }

  public getUserId (): string {
    return this.userId
  }

  public getTitle (): string {
    return this.title
  }

  public getSlug (): string {
    return this.slug
  }

  public getDescription (): string {
    return this.description
  }

  public getEmail (): string {
    return this.email
  }

  public getAddress (): string {
    return this.address
  }

  public getCompany (): string {
    return this.company
  }

  public getIndustry (): Array<string> {
    return this.industry.getIndustryType()
  }

  public getJobType (): string {
    return this.jobType.getJobType()
  }

  public getMinEducation (): string {
    return this.minEducation.getEducationLevel()
  }

  public getExperience (): string {
    return this.experience.getExperience()
  }

  public getSalary (): Number {
    return this.salary
  }

  public getPosition (): Number {
    return this.position
  }

  public getPostingDate (): Date {
    return this.postingDate
  }

  public getLastDate (): Date {
    return this.lastDate
  }
}
