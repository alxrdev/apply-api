import multer from 'multer'
import path from 'path'
import IStorageSettings from '../../services/storage/interfaces/IStorageSettings'
import InvalidArgumentError from '../../errors/InvalidArgumentError'

const fileUpload = (storageSettings: IStorageSettings) => {
  const { storageEngine, storageFileMaxSize, storageFileExtensionTypes, storageFileMIMETypes } = storageSettings

  return multer({
    storage: storageEngine,

    limits: {
      fileSize: storageFileMaxSize
    },

    fileFilter: function (req, file, cb) {
      if (file.size > storageFileMaxSize) {
        return cb(new InvalidArgumentError('Invalid param', false, 400, {
          propertie: file.fieldname,
          value: file.originalname,
          constraints: {
            fileSize: 'Please upload file less than 2MB.'
          }
        }))
      }

      const suportedExtensionFiles = storageFileExtensionTypes.split(',')
      const filePath = path.extname(file.originalname)

      if (!suportedExtensionFiles.includes(filePath)) {
        return cb(new InvalidArgumentError('Invalid param', false, 400, {
          propertie: file.fieldname,
          value: file.originalname,
          constraints: {
            fileType: `resume file shoud be a: ${suportedExtensionFiles}.`
          }
        }))
      }

      const suportedMimeFiles = storageFileMIMETypes.split(',')

      if (!suportedMimeFiles.includes(file.mimetype)) {
        return cb(new InvalidArgumentError('Invalid param', false, 400, {
          propertie: file.fieldname,
          value: file.originalname,
          constraints: {
            fileType: `resume file shoud be a: ${suportedMimeFiles}.`
          }
        }))
      }

      return cb(null, true)
    }
  })
}

export default fileUpload
