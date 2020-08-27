import Address from './Address'

export default interface JobResponse {
  id: string
  userId: string
  title: string
  description: string
  address: Address
  jobType: string
  workTime: string
  workplace: string
  featured: boolean
  tags: string
  salary: number
  lastDate: Date
  createdAt: Date
}
