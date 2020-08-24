export default interface JobResponse {
  id: string
  userId: string
  slug: string
  title: string
  description: string
  email: string
  address: string
  company: string
  industry: Array<string>
  jobType: string
  minEducation: string
  experience: string
  salary: Number
  position: Number
  postingDate: Date
  lastDate: Date
}
