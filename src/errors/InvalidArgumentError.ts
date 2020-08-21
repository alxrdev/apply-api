import AppError from './AppError'

export default class InvalidArgumentError extends AppError {
  constructor (message: string, public readonly isInternal: boolean = true, public readonly statusCode: number = 500, public readonly errorDetails?: Object | Array<Object>) {
    super(message, isInternal, statusCode, errorDetails)

    this.name = this.constructor.name
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
