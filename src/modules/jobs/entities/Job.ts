import Address from './Address'
import { User } from '@modules/users/entities'
import { Entity } from '@src/modules/shared/entities'
import JobBuilder from '@modules/jobs/utils/JobBuilder'

interface IJobProps {
  user: User
  title: string
  description: string
  address: Address
  jobType: string
  salary: number
  createdAt: Date
}

export default class Job extends Entity<IJobProps> {
  private constructor (props: IJobProps, id?: string) {
    super(props, id)
  }

  public static create (props: IJobProps, id?: string) : Job {
    return new Job(props, id)
  }

  public static builder () {
    return new JobBuilder()
  }

  get user () : User {
    return this.props.user
  }

  set user (user: User) {
    this.props.user = user
  }

  get title () : string {
    return this.props.title
  }

  set title (title: string) {
    this.props.title = title
  }

  get description () : string {
    return this.props.description
  }

  set description (description: string) {
    this.props.description = description
  }

  get address () : Address {
    return this.props.address
  }

  set address (address: Address) {
    this.props.address = address
  }

  get jobType () : string {
    return this.props.jobType
  }

  set jobType (jobType: string) {
    this.props.jobType = jobType
  }

  get salary () : number {
    return this.props.salary
  }

  set salary (salary: number) {
    this.props.salary = salary
  }

  get createdAt () : Date {
    return this.props.createdAt
  }

  set createdAt (createdAt: Date) {
    this.props.createdAt = createdAt
  }
}
