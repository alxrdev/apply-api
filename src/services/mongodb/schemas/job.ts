import mongoose from 'mongoose'
import validator from 'validator'
import geoCoder from '../../../utils/geocoder'

const jobSchema = new mongoose.Schema({
  _id: String,

  title: {
    type: String,
    required: [true, 'Please enter Job title.'],
    trim: true,
    maxlength: [100, 'Job title can not exceed 100 characters.']
  },

  slug: String,

  description: {
    type: String,
    required: [true, 'Please enter Job description.'],
    maxlength: [1000, 'Job description can not exceed 1000 characters.']
  },

  email: {
    type: String,
    validate: [validator.isEmail, 'Please add a valid email address.']
  },

  address: {
    type: String,
    required: [true, 'Please add an address.']
  },

  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },

  company: {
    type: String,
    required: [true, 'Please add Company name.']
  },

  industry: {
    type: [String],
    required: true,
    enum: {
      values: [
        'Business',
        'Information Technology',
        'Banking',
        'Education/Training',
        'Telecommunication',
        'Others'
      ],
      message: 'Please select correct options for Industry.'
    }
  },

  jobType: {
    type: String,
    required: true,
    enum: {
      values: [
        'Permanent',
        'Temporary',
        'Internship'
      ],
      message: 'Please select correct options for Job type.'
    }
  },

  minEducation: {
    type: String,
    required: true,
    enum: {
      values: [
        'Bachelors',
        'Masters',
        'Phd'
      ],
      message: 'Please select correct options for Education.'
    }
  },

  position: {
    type: Number,
    default: 1
  },

  experience: {
    type: String,
    required: true,
    enum: {
      values: [
        'No Experience',
        '1 Year - 2 Years',
        '2 Years - 5 Years',
        '5 Years+'
      ],
      message: 'Please select correct options for Experience.'
    }
  },

  salary: {
    type: Number,
    required: [true, 'Please enter expected salary for this job.']
  },

  postingDate: {
    type: Date,
    default: Date.now
  },

  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7)
  },

  applicantsApplied: {
    type: [Object],
    select: false
  }
})

// Setting up location
jobSchema.pre<IJob>('save', async function (next) {
  const location = await geoCoder.geocode(this.address)

  this.location = {
    type: 'Point',
    coordinates: [location[0].longitude ?? 0, location[0].latitude ?? 0],
    formattedAddress: location[0].formattedAddress,
    city: location[0].city,
    state: location[0].stateCode,
    zipcode: location[0].zipcode,
    country: location[0].countryCode
  }

  next()
})

export interface IJob extends mongoose.Document {
  slug: string
  title: string
  description: string
  email: string
  address: string
  location?: {
    type: string,
    coordinates: Array<number>,
    formattedAddress?: String,
    city?: String,
    state?: String,
    zipcode?: String,
    country?: String
  }
  company: string
  industry: Array<string>
  jobType: string
  minEducation: string
  experience: string
  salary: Number
  position: Number
  postingDate: Date
  lastDate: Date
}

const jobModel = mongoose.model<IJob>('Job', jobSchema)

export default jobModel
