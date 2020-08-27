import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  _id: String,

  title: {
    type: String,
    required: [true, 'Please enter Job title.'],
    trim: true,
    maxlength: [100, 'Job title can not exceed 100 characters.']
  },

  description: {
    type: String,
    required: [true, 'Please enter Job description.'],
    maxlength: [1000, 'Job description can not exceed 1000 characters.']
  },

  address: {
    type: {
      country: String,
      city: String,
      zipcode: String
    },
    required: [true, 'Please add an address.']
  },

  jobType: {
    type: String,
    required: true,
    enum: {
      values: [
        'Permanent',
        'Temporary',
        'Internship',
        'Freelancer'
      ],
      message: 'Please select correct options for Job type.'
    }
  },

  workTime: {
    type: String,
    required: true,
    enum: {
      values: [
        'Full Time',
        'Part Time'
      ],
      message: 'Please select the work time.'
    }
  },

  workplace: {
    type: String,
    required: true,
    message: 'Please add the workplace.'
  },

  fetured: {
    type: Boolean,
    default: false
  },

  tags: {
    type: String,
    required: false
  },

  salary: {
    type: Number,
    required: [true, 'Please enter expected salary for this job.']
  },

  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7)
  },

  applicantsApplied: {
    type: [Object],
    select: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  user: {
    type: String,
    ref: 'User',
    required: true
  }
})

export interface IJob extends mongoose.Document {
  user: string
  title: string
  description: string
  address: {
    country: String,
    city: String,
    zipcode: String
  },
  jobType: string
  workTime: string
  workPlace: string
  fetured: boolean
  tags: string
  salary: number
  lastDate: Date
  applicantsApplied?: Array<{
    id: string
    resume: string
  }>
  createdAt: Date
}

const jobModel = mongoose.model<IJob>('Job', jobSchema)

export default jobModel
