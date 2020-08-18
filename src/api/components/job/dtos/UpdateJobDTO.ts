import Industry from '../entities/Industry'
import JobType from '../entities/JobTypes'
import Experience from '../entities/Experience'
import Education from '../entities/Education'

export default interface UpdateJobDTO {
  id: string
  title: string
  description: string
  email: string
  address: string
  company: string
  industry: Industry
  jobType: JobType
  minEducation: Education
  experience: Experience
  salary: Number
  position: Number
}
