import AppError from '../../../../errors/AppError'

export default class JobNotFoundError extends AppError {
  constructor (message: string, public readonly isInternal: boolean = true, public readonly statusCode: number = 500) {
    super(message, isInternal, statusCode)

    this.name = this.constructor.name
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
