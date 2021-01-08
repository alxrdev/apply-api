import axios from 'axios'
import { AppError } from '../../errors'
const concat = require('concat-stream')
const formData = require('form-data')

interface StorageOptions {
  filename: (file: Express.Multer.File) => string
  url: string
}

class MulterApiStorage {
  constructor (private opts: StorageOptions) {}

  _handleFile (req: any, file: Express.Multer.File, cb: CallableFunction) {
    try {
      const filename = this.opts.filename(file)

      const form = new formData()
      
      form.append(file.fieldname, file.stream, {filename: filename})

      form.pipe(concat({encoding: 'buffer'}, (data: any) => {
        axios.post(this.opts.url, data, { headers: form.getHeaders() })
          .then(response => {
            cb(null, { ...response.data, filename })
          })
          .catch(err => {
            cb(err.response.data, null)
          })
      }))
    } catch(err) {
      throw new AppError(err.message)
    }
  }

  _removeFile (req: any, file: Express.Multer.File, cb: CallableFunction) {
    cb(null)
  }
}

const multerApiStorage = (opts: StorageOptions) => {
  return new MulterApiStorage(opts)
}

export default multerApiStorage
