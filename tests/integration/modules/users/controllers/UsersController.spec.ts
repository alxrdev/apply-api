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
import { User } from '@src/modules/users/entities'
import { generateToken } from '@src/../tests/setup/auth'

describe('Test the UserController class', () => {
  const app = new App().getServer()
  const createUser: CreateUserUseCase = container.resolve(CreateUserUseCase)
  let createdUser: User

  beforeAll(async () => {
    await openConnection()
    createdUser = await createUser.execute({ name: 'John Doe', email: 'user@email.com', role: 'user', password: '12345678', confirmPassword: '12345678' })
  })

  afterAll(async () => {
    await clearDatabase()
    await closeConnection()
  })

  it('Should successful create a new user', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'newuser@email.com', role: 'user', password: '12345678', confirmPassword: '12345678' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'User created')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('id')
        expect(response.body.data).toHaveProperty('name', 'John Doe')
        expect(response.body.data).toHaveProperty('role', 'user')
        expect(response.body.data).toHaveProperty('avatar')
        expect(response.body.data).toHaveProperty('headline')
        expect(response.body.data).toHaveProperty('bio')
        expect(response.body.data).toHaveProperty('address')
        expect(response.body.data).toHaveProperty('createdAt')
      })
  })

  it('Should not create an user when the provided data is invalid', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: '', email: 'user@email', role: 'user', password: '123', confirmPassword: '1234' })
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('error_status_code', 400)
        expect(response.body).toHaveProperty('error_message', 'Invalid parameters.')
        expect(response.body).toHaveProperty('error_details')
        expect(response.body.error_details.length).toBe(4)
      })
  })

  it('Should not create an user when the provided email already exists', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'user@email.com', role: 'user', password: '12345678', confirmPassword: '12345678' })
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('error_status_code', 400)
        expect(response.body).toHaveProperty('error_message', 'An user already exists with this same e-mail.')
      })
  })

  it('Should return a 404 error when trying to get an user that does not exist', async () => {
    await request(app)
      .get('/api/users/invalid@email.com')
      .then(response => {
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('error_status_code', 404)
        expect(response.body).toHaveProperty('error_message', 'User not found.')
      })
  })

  it('Should return an user', async () => {
    await request(app)
      .get('/api/users/user@email.com')
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'Show user')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('id')
        expect(response.body.data).toHaveProperty('name')
        expect(response.body.data).toHaveProperty('role')
        expect(response.body.data).toHaveProperty('avatar')
        expect(response.body.data).toHaveProperty('headline')
        expect(response.body.data).toHaveProperty('bio')
        expect(response.body.data).toHaveProperty('address')
        expect(response.body.data).toHaveProperty('createdAt')
      })
  })

  it('Should not update an user when is not the authenticated user', async () => {
    const token = generateToken('1234567', 'user')

    await request(app)
      .put('/api/users/123456')
      .send({ name: 'John Doe', headline: 'My headline', bio: 'My bio', address: 'My location' })
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .then(response => {
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('error_status_code', 403)
        expect(response.body).toHaveProperty('error_message', 'You don\'t have permission to update this user.')
      })
  })

  it('Should update an user', async () => {
    const token = generateToken(createdUser.id, 'user')

    await request(app)
      .put(`/api/users/${createdUser.id}`)
      .send({ name: 'John Doe', headline: 'My headline', bio: 'My bio', address: 'My location' })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(response => {
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'User updated')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('id', createdUser.id)
        expect(response.body.data).toHaveProperty('name', 'John Doe')
        expect(response.body.data).toHaveProperty('role', 'user')
        expect(response.body.data).toHaveProperty('avatar')
        expect(response.body.data).toHaveProperty('headline', 'My headline')
        expect(response.body.data).toHaveProperty('bio', 'My bio')
        expect(response.body.data).toHaveProperty('address', 'My location')
        expect(response.body.data).toHaveProperty('createdAt')
      })
  })

  it('Should not delete an user when the role of the authenticated user is the same as user or employer', async () => {
    const token = generateToken(createdUser.id, 'user')

    await request(app)
      .delete(`/api/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .then(response => {
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('error_status_code', 403)
        expect(response.body).toHaveProperty('error_message', 'Role (user) is not allowed to access this resource.')
      })
  })

  it('Should delete an user', async () => {
    const token = generateToken(createdUser.id, 'admin')

    await request(app)
      .delete(`/api/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })
})
