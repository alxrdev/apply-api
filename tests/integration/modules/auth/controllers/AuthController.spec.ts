import { container } from 'tsyringe'
import '@tests/setup/container'
import {
  openConnection,
  closeConnection,
  clearDatabase
} from '@tests/setup/database'
import request from 'supertest'
import App from '@src/app'
import { CreateUserUseCase } from '@modules/users/useCases'

describe('Test the AuthController class', () => {
  const app = new App().getServer()
  const createUser: CreateUserUseCase = container.resolve(CreateUserUseCase)

  beforeAll(async () => {
    await openConnection()
    await createUser.execute({ name: 'John Doe', email: 'user@email.com', role: 'user', password: '12345678', confirmPassword: '12345678' })
  })

  afterAll(async () => {
    await clearDatabase()
    await closeConnection()
  })

  it('Should authenticate an user', async () => {
    await request(app)
      .post('/api/auth')
      .send({ email: 'user@email.com', password: '12345678' })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'User authenticated.')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('token')
        expect(response.body.data).toHaveProperty('user')
      })
  })

  it('Should not authenticate the user when the data provided is invalid', async () => {
    await request(app)
      .post('/api/auth')
      .send({ email: 'user@email.com', password: 'wrongPassword' })
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('error_status_code', 401)
        expect(response.body).toHaveProperty('error_message', 'Incorrect email/password combination.')
      })
  })

  it('Should return an error when trying to get the authenticated user with an invalid access token', async () => {
    const token = 'invalid-token'

    await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('error_status_code', 401)
        expect(response.body).toHaveProperty('error_message', 'Invalid JWT token.')
      })
  })

  it('Should return the authenticated user', async () => {
    const token = await request(app)
      .post('/api/auth')
      .send({ email: 'user@email.com', password: '12345678' })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        return response.body.data.token
      })

    await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'Authenticated user')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('id')
        expect(response.body.data).toHaveProperty('name', 'John Doe')
        expect(response.body.data).toHaveProperty('role', 'user')
        expect(response.body.data).toHaveProperty('email', 'user@email.com')
        expect(response.body.data).toHaveProperty('avatar')
        expect(response.body.data).toHaveProperty('headline')
        expect(response.body.data).toHaveProperty('bio')
        expect(response.body.data).toHaveProperty('address')
        expect(response.body.data).toHaveProperty('createdAt')
      })
  })
})
