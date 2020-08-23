import Job from '../entities/Job'
import JobResponse from '../entities/JobResponse'

export default class JobMapper {
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
