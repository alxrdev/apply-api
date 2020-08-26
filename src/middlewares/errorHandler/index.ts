import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import AppError from '../../errors/AppError'

dotenv.config()

const env = process.env.NODE_ENV ?? 'production'

const apiErrorHandlerMiddleware = (error: Error, request: Request, response: Response, next: NextFunction) => {
  if (env === 'development') {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .json({
          success: false,
          message: 'Ops! We have an error :(',
          error_message: error.message,
          error_status_code: error.statusCode,
          error_details: error?.errorDetails
        })
    }

    return response
      .status(500)
      .json({
        success: false,
        message: 'Ops! We have an error :(',
        error_message: error.message,
        error_status_code: 500
      })
  }

  if (error instanceof AppError && error.isInternal === false) {
    return response
      .status(error.statusCode)
      .json({
        success: false,
        message: 'Ops! We have an error :(',
        error_message: error.message,
        error_status_code: error.statusCode,
        error_details: error?.errorDetails
      })
  }

  return response
    .status(500)
    .json({
      success: false,
      message: 'Ops! We have an error :(',
      error_message: 'Internal server error',
      error_status_code: 500
    })
}

export default apiErrorHandlerMiddleware
