import InvalidArgumentError from '../../../../errors/InvalidArgumentError'

export default class JobType {
  private jobType: string

  constructor (jobType: string) {
    this.checkJobType(jobType)
    this.jobType = jobType
  }

  public getJobType (): string {
    return this.jobType
  }

  private checkJobType (jobType: string): void {
    const jobTypes: Array<string> = ['Permanent', 'Temporary', 'Internship']
    if (!jobTypes.includes(jobType)) {
      throw new InvalidArgumentError('The job type should be: \'Permanent\', \'Temporary\' or \'Internship\'.', false, 400)
    }
  }
}
