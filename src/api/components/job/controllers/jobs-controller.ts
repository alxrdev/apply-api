import { Request, Response } from 'express'

class JobsController {
  public index (request: Request, response: Response) {
    return response.status(200).json({
      success: true,
      message: 'This route will display all jobs in future.'
    })
  }
}

export default JobsController
