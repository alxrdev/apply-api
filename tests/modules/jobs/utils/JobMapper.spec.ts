import { Address, Job, UserApplied } from "@modules/jobs/entities"
import JobMapper from "@modules/jobs/utils/JobMapper"
import { User } from "@modules/users/entities"

const makeJob = (fields = {}) : Job => {
	const data = {
		id: '1', 
		user: new User('2', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''), 
		title: 'First job',
		description: 'this is the first job', 
		address: new Address('ES', 'São Mateus'), 
		jobType: 'full-time', 
		salary: 1200.00, 
		createdAt: new Date(),
		...fields
	}
	
	return new Job(data.id, data.user, data.title, data.description, data.address, data.jobType, data.salary, data.createdAt)
}

const makeUserApplied = (fields = {}) : UserApplied => {
  return {
    user: new User('2', 'user', 'user@email.com', 'user', 'user.jpg', 'password', '', '', ''),
    resume: 'resume.pdf'
  }
}

describe('Test the JobMapper class', () => {
  it('Should convert a Job to a JobResponse', () => {
    const job = makeJob()
    const jobResponse = JobMapper.fromJobToJobResponse(job)

    expect(jobResponse).toHaveProperty('id')
    expect(jobResponse).toHaveProperty('user')
    expect(jobResponse).toHaveProperty('title')
    expect(jobResponse).toHaveProperty('description')
    expect(jobResponse).toHaveProperty('address')
    expect(jobResponse.address).toHaveProperty('state')
    expect(jobResponse.address).toHaveProperty('city')
    expect(jobResponse).toHaveProperty('jobType')
    expect(jobResponse).toHaveProperty('salary')
    expect(jobResponse).toHaveProperty('createdAt')
  })

  it('Should convert a Job array to a JobResponse array', () => {
    const jobs = [makeJob(), makeJob({ id: '2' })]
    const jobsResponse = JobMapper.fromJobArrayToJobResponseArray(jobs)

    expect(jobsResponse.length).toBe(2)

    expect(jobsResponse[0]).toHaveProperty('id')
    expect(jobsResponse[0]).toHaveProperty('user')
    expect(jobsResponse[0]).toHaveProperty('title')
    expect(jobsResponse[0]).toHaveProperty('description')
    expect(jobsResponse[0]).toHaveProperty('address')
    expect(jobsResponse[0].address).toHaveProperty('state')
    expect(jobsResponse[0].address).toHaveProperty('city')
    expect(jobsResponse[0]).toHaveProperty('jobType')
    expect(jobsResponse[0]).toHaveProperty('salary')
    expect(jobsResponse[0]).toHaveProperty('createdAt')

    expect(jobsResponse[1]).toHaveProperty('id')
    expect(jobsResponse[1]).toHaveProperty('user')
    expect(jobsResponse[1]).toHaveProperty('title')
    expect(jobsResponse[1]).toHaveProperty('description')
    expect(jobsResponse[1]).toHaveProperty('address')
    expect(jobsResponse[1].address).toHaveProperty('state')
    expect(jobsResponse[1].address).toHaveProperty('city')
    expect(jobsResponse[1]).toHaveProperty('jobType')
    expect(jobsResponse[1]).toHaveProperty('salary')
    expect(jobsResponse[1]).toHaveProperty('createdAt')
  })

  it('Should convert a UserApplied to a UserAppliedResponse', () => {
    const userApplied = makeUserApplied()
    const userAppliedResponse = JobMapper.fromUserAppliedToUserAppliedResponse(userApplied)

    expect(userAppliedResponse).toHaveProperty('user')
    expect(userAppliedResponse).toHaveProperty('resume')
  })

  it('Should convert a UserApplied array to a UserAppliedResponse array', () => {
    const usersApplied = [makeUserApplied(), makeUserApplied()]
    const usersAppliedResponse = JobMapper.fromUserAppliedArrayToUserAppliedResponseArray(usersApplied)

    expect(usersAppliedResponse.length).toBe(2)

    expect(usersAppliedResponse[0]).toHaveProperty('user')
    expect(usersAppliedResponse[0]).toHaveProperty('resume')

    expect(usersAppliedResponse[1]).toHaveProperty('user')
    expect(usersAppliedResponse[1]).toHaveProperty('resume')
  })
})