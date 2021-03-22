import { InvalidArgumentError } from '@errors/index'
import validatePasswordAndConfirmPassword from '@modules/users/utils/validatePasswordAndConfirmPassword'

describe('Test the validatePasswordAndConfirmPassword util function', () => {
  it('Should throw an InvalidArgumentError when passwords does not match', () => {
    expect(() => {
      validatePasswordAndConfirmPassword('mypassword', 'myinvalidpassword')
    }).toThrowError(InvalidArgumentError)
  })

  it('Should not throw an error when passwords match', () => {
    expect(() => {
      validatePasswordAndConfirmPassword('mypassword', 'mypassword')
    }).not.toThrow()
  })
})
