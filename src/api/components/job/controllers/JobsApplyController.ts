// import ApplyToJobUseCase from '../useCases/ApplyToJobUseCase'
import { Request, Response, NextFunction } from 'express'

export default class JobsApplyController {
  constructor () {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const file = request.file

    try {
      return response.status(201).json({
        sucess: true,
        message: 'User applied to job.',
        data: {
          resume: (file) ? file.filename : 'file not uploaded.'
        }
      })
    } catch (error) {
      return next(error)
    }
  }
}
