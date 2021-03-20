import { showUserUseCase, authenticateUserUseCase } from '@tests/container.setup'

import request from 'supertest'

import App from '@src/app'
import { User } from '@src/modules/users/entities'
import { generateToken } from '@tests/auth'
import { AuthenticationError } from '@modules/auth/errors'

describe('Test the AuthController class', () => {
  const app = new App().getServer()

  it('Should authenticate an user', async () => {
    const spyAuthenticateUserUseCase = jest.spyOn(authenticateUserUseCase, 'execute').mockImplementation(async () => {
      return {
        token: 'auth-token',
        user: new User('123456', 'John Doe', 'user@email.com', 'user', 'default', '', '', '', '', new Date())
      }
    })

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

    spyAuthenticateUserUseCase.mockRestore()
  })

  it('Should not authenticate the user when the data provided is invalid', async () => {
    const spyAuthenticateUserUseCase = jest.spyOn(authenticateUserUseCase, 'execute').mockImplementation(async () => {
      throw new AuthenticationError('Incorrect email/password combination.', false, 401)
    })

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

    spyAuthenticateUserUseCase.mockRestore()
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
    const spyShowUserUseCase = jest.spyOn(showUserUseCase, 'execute').mockImplementation(async () => {
      return new User('123456', 'John Doe', 'user@email.com', 'user', 'default', '', '', '', '', new Date())
    })

    const token = generateToken('123456', 'user')

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
        expect(response.body.data).toHaveProperty('id', '123456')
        expect(response.body.data).toHaveProperty('name', 'John Doe')
        expect(response.body.data).toHaveProperty('role', 'user')
        expect(response.body.data).toHaveProperty('email', 'user@email.com')
        expect(response.body.data).toHaveProperty('avatar')
        expect(response.body.data).toHaveProperty('headline')
        expect(response.body.data).toHaveProperty('bio')
        expect(response.body.data).toHaveProperty('address')
        expect(response.body.data).toHaveProperty('createdAt')
      })

    spyShowUserUseCase.mockRestore()
  })
})
