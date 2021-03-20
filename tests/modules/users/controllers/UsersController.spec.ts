import { createUserUseCase, deleteUserUseCase, showUserUseCase, updateUserUseCase } from '@tests/container.setup'

import request from 'supertest'

import App from '@src/app'
import { User } from '@modules/users/entities'
import { UserAlreadyExistsError, UserNotFoundError } from '@modules/users/errors'
import { generateToken } from '@tests/auth'

describe('Test the UserController class', () => {
  const app = new App().getServer()

  it('Should successful create a new user', async () => {
    const spyCreateUserUseCase = jest.spyOn(createUserUseCase, 'execute').mockResolvedValue(
      new User('123456', 'John Doe', 'user@email.com', 'user', 'default', '', '', '', '', new Date())
    )

    await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'user@email.com', role: 'user', password: '12345678', confirmPassword: '12345678' })
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

    spyCreateUserUseCase.mockRestore()
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
    const spyCreateUserUseCase = jest.spyOn(createUserUseCase, 'execute').mockImplementation(async () => {
      throw new UserAlreadyExistsError('An user already exists with this same e-mail.', false, 400)
    })

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

    spyCreateUserUseCase.mockRestore()
  })

  it('Should return a 404 error when trying to get an user that does not exist', async () => {
    const spyShowUserUseCase = jest.spyOn(showUserUseCase, 'execute').mockImplementation(async () => {
      throw new UserNotFoundError('User not found.', false, 404)
    })

    await request(app)
      .get('/api/users/user@email.com')
      .then(response => {
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('error_status_code', 404)
        expect(response.body).toHaveProperty('error_message', 'User not found.')
      })

    spyShowUserUseCase.mockRestore()
  })

  it('Should return an user', async () => {
    const spyShowUserUseCase = jest.spyOn(showUserUseCase, 'execute').mockImplementation(async () => {
      return new User('123456', 'John Doe', 'user@email.com', 'user', 'default', '', '', '', '', new Date())
    })

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

    spyShowUserUseCase.mockRestore()
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
    const spyUpdateUserUseCase = jest.spyOn(updateUserUseCase, 'execute').mockImplementation(async () => {
      return new User('123456', 'John Doe', 'user@email.com', 'user', 'default.jpg', '', 'My headline', 'My location', 'My bio', new Date())
    })

    const token = generateToken('123456', 'user')

    await request(app)
      .put('/api/users/123456')
      .send({ name: 'John Doe', headline: 'My headline', bio: 'My bio', address: 'My location' })
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(response => {
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('message', 'User updated')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('id', '123456')
        expect(response.body.data).toHaveProperty('name', 'John Doe')
        expect(response.body.data).toHaveProperty('role', 'user')
        expect(response.body.data).toHaveProperty('avatar')
        expect(response.body.data).toHaveProperty('headline', 'My headline')
        expect(response.body.data).toHaveProperty('bio', 'My bio')
        expect(response.body.data).toHaveProperty('address', 'My location')
        expect(response.body.data).toHaveProperty('createdAt')
      })

    spyUpdateUserUseCase.mockRestore()
  })

  it('Should not delete an user when the role of the authenticated user is the same as user or employer', async () => {
    const token = generateToken('1234567', 'user')

    await request(app)
      .delete('/api/users/123456')
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
    const spyDeleteUserUseCase = jest.spyOn(deleteUserUseCase, 'execute').mockImplementation()

    const token = generateToken('1234567', 'admin')

    await request(app)
      .delete('/api/users/123456')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    spyDeleteUserUseCase.mockRestore()
  })
})
