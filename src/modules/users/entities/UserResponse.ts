export default interface UserResponse {
  id: string
  name: string
  email?: string
  role: string
  avatar: string
  headline: string
  address: string
  bio: string
  createdAt: Date
}
