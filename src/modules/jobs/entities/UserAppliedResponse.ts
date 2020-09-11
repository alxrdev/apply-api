import { UserResponse } from '../../users/entities'

export default interface UserAppliedResponse {
  user: UserResponse,
  resume: string
}
