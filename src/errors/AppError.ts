export default class AppError extends Error {
  constructor (message: string, public readonly isInternal: boolean = true, public readonly statusCode: number = 500, public readonly errorDetails?: Object | Array<Object>) {
    super(message)

    this.name = this.constructor.name
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
