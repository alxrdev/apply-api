import {
  IsEmail, MaxLength, IsNotEmpty, IsString, IsNumber, IsDate, ValidateIf, isEmpty
} from 'class-validator'
import Industry from './Industry'
import JobType from './JobTypes'
import Education from './Education'
import Experience from './Experience'

export default class Job {
  @IsString()
  @IsNotEmpty()
  private id: string

  @MaxLength(100)
  @IsNotEmpty()
  private title: string

  @ValidateIf(o => !isEmpty(o.title))
  @IsNotEmpty()
  private slug: string

  @MaxLength(1000)
  @IsNotEmpty()
  private description: string

  @IsEmail()
  @IsNotEmpty()
  private email: string

  @IsNotEmpty()
  private address: string

  @IsNotEmpty()
  private company: string

  @IsNotEmpty()
  private industry: Industry

  @IsNotEmpty()
  private jobType: JobType

  @IsNotEmpty()
  private minEducation: Education

  @IsNotEmpty()
  private experience: Experience

  @IsNotEmpty()
  @IsNumber()
  private salary: Number

  @IsNumber()
  private position: Number

  @IsDate()
  private postingDate: Date

  @IsDate()
  private lastDate: Date

  constructor (id: string, title: string, slug: string, description: string, email: string, address: string, company: string, industry: Industry, jobType: JobType, minEducation: Education, experience: Experience, salary: Number, position: Number, postingDate: Date, lastDate: Date) {
    this.id = id
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
