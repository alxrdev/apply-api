import { AppError } from '../../../errors'

export default class UserNotFouldError extends AppError {
  constructor (message: string, public readonly isInternal: boolean = true, public readonly statusCode: number = 500, public readonly errorDetails?: Object | Array<Object>) {
    super(message, isInternal, statusCode, errorDetails)

    this.name = this.constructor.name
    Object.setPrototypeOf(this, UserNotFouldError.prototype)
  }
}
