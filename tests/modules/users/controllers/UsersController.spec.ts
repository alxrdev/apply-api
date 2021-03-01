import '../../../container.setup'
import request from 'supertest'
import App from '@src/app'

// jest.mock('@src/modules/users/repositories/fake/FakeUserRepository')
// jest.mock('@src/modules/jobs/repositories/fake/FakeJobRepository')

const app = new App().getServer()

describe('Test the UserController class', () => {
  it('Should return a 404 error when trying to get an user that does not exist', async () => {
    const response = await request(app).get('/api/users/user@email.com')
    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error_status_code).toBe(404)
    expect(response.body.error_message).toBe('User not found.')
  })
})
