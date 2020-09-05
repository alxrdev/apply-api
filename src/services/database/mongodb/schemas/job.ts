import mongoose from 'mongoose'
import { IUser } from './user'

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
      state: String,
      city: String
    },
    required: [true, 'Please add an address.']
  },

  jobType: {
    type: String,
    required: true,
    enum: {
      values: [
        'Full-time',
        'Part-time',
        'Permanent',
        'Temporary',
        'Contract',
        'Internship'
      ],
      message: 'Please select correct options for Job type.'
    }
  },

  salary: {
    type: Number,
    required: [true, 'Please enter expected salary for this job.']
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  user: {
    type: String,
    ref: 'User',
    required: true
  },

  applicantsApplied: {
    type: [Object],
    select: false
  }
})

export interface IJob extends mongoose.Document {
  user: IUser | string
  title: string
  description: string
  address: {
    state: String,
    city: String
  },
  jobType: string
  salary: number
  applicantsApplied?: Array<{
    id: string
    resume: string
  }>
  createdAt: Date
}

const jobModel = mongoose.model<IJob>('Job', jobSchema)

export default jobModel
