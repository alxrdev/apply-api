import AppError from '../../../errors/AppError'

export default class ApplyError extends AppError {
  constructor (message: string, public readonly isInternal: boolean = true, public readonly statusCode: number = 500, public readonly errorDetails?: Object | Array<Object>) {
    super(message, isInternal, statusCode, errorDetails)

    this.name = this.constructor.name
    Object.setPrototypeOf(this, ApplyError.prototype)
  }
}
