import AppError from './AppError'

export default class InvalidArgumentError extends AppError {
  constructor (message: string, public readonly isInternal: boolean = true, public readonly statusCode: number = 500) {
    super(message, isInternal, statusCode)

    this.name = this.constructor.name
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
