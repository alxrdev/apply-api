import Address from './Address'
import { UserResponse } from '../../users/entities'

export default interface JobResponse {
  id: string
  user: UserResponse,
  title: string
  description: string
  address: Address
  jobType: string
  salary: number
  createdAt: Date
}
