import InvalidArgumentError from '../../../../errors/InvalidArgumentError'

const validatePasswordAndConfirmPassword = (password: string, confirmPassword: string): void => {
  if (password !== confirmPassword) {
    throw new InvalidArgumentError('Invalid parameters.', false, 400, {
      property: 'confirmPassword',
      value: confirmPassword,
      constraints: {
        match: 'the password and confirmPassword properties are not the same.'
      }
    })
  }
}

export default validatePasswordAndConfirmPassword
