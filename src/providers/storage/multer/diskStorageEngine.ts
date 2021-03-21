import path from 'path'
import crypto from 'crypto'
import { diskStorage as multerDiskStorage } from 'multer'

const diskStorageEngine = (tmpDestination: string) => multerDiskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDestination)
  },
  filename: function (req, file, cb) {
    const fileHash = crypto.randomBytes(10).toString('hex')
    const fileName = `${fileHash}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, fileName)
  }
})

export default diskStorageEngine
