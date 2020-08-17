import CreateJobDTO from '../dtos/CreateJobDTO'
import Industry from '../entities/Industry'
import JobType from '../entities/JobTypes'
import Education from '../entities/Education'
import Experience from '../entities/Experience'
import Job from '../entities/Job'
import JobResponse from '../entities/JobResponse'

export default class JobMapper {
  public static fromBodyToCreateJobDTO (title: string, description: string, email: string, address: string, company: string, industry: Array<string>, jobType: string, minEducation: string, experience: string, salary: number, position: number): CreateJobDTO {
    const jobDto: CreateJobDTO = {
      title: title,
      description: description,
      email: email,
      address: address,
      company: company,
      industry: new Industry(industry),
      jobType: new JobType(jobType),
      minEducation: new Education(minEducation),
      experience: new Experience(experience),
      salary: salary,
      position: position
    }

    return jobDto
  }

  public static fromJobToJobResponse (job: Job): JobResponse {
    return {
      id: job.getId(),
      title: job.getTitle(),
      description: job.getDescription(),
      slug: job.getSlug(),
      email: job.getEmail(),
      address: job.getAddress(),
      company: job.getCompany(),
      industry: job.getIndustry(),
      jobType: job.getJobType(),
      minEducation: job.getMinEducation(),
      position: job.getPosition(),
      experience: job.getExperience(),
      salary: job.getSalary(),
      postingDate: job.getPostingDate(),
      lastDate: job.getLastDate()
    }
  }

  public static fromJobArrayToJobResponseArray (jobs: Array<Job>): Array<JobResponse> {
    const result = jobs.map(job => JobMapper.fromJobToJobResponse(job))
    return result
  }
}
