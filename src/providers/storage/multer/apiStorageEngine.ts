import path from 'path'
import crypto from 'crypto'

import multerApiStorage from './multerApiStorage'

const apiStorageEngine = (request?: string) => multerApiStorage({
  filename: function (file: any) {
    const fileHash = crypto.randomBytes(10).toString('hex')
    return `${fileHash}-${Date.now()}${path.extname(file.originalname)}`
  },
  url: request || ''
})

export default apiStorageEngine
