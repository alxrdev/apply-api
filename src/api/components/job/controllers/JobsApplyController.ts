// import ApplyToJobUseCase from '../useCases/ApplyToJobUseCase'
import { Request, Response, NextFunction } from 'express'
import IStorageService from '../../../../services/storage/interfaces/IStorageService'

export default class JobsApplyController {
  constructor (
    private readonly dskStrg: IStorageService
  ) {}

  public create = async (request: Request, response: Response, next: NextFunction) => {
    const file = request.file

    try {
      await this.dskStrg.delete(file.filename)

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
