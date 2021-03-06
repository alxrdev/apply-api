import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  _id: String,

  name: {
    type: String,
    required: [true, 'Please enter your name']
  },

  email: {
    type: String,
    required: [true, 'Please enter your email address'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },

  role: {
    type: String,
    enum: {
      values: ['user', 'employer'],
      message: 'Please select correct role'
    },
    default: 'user'
  },

  avatar: {
    type: String,
    required: false,
    default: 'default.jpg'
  },

  headline: {
    type: String,
    required: false
  },

  address: {
    type: String,
    required: false
  },

  bio: {
    type: String,
    required: false,
    maxlength: [80, 'Your bio must be at least 80 characters']
  },

  password: {
    type: String,
    required: [true, 'Please enter password for your account'],
    minlength: [8, 'Your password must be at least 8 characters long']
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  resetPasswordToken: String,

  resetPasswordExpire: Date
})

export interface IUser extends mongoose.Document {
  name: string
  email: string
  role: string
  avatar: string
  password: string
  headline?: string
  address?: string
  bio?: string
  resetPasswordToken?: string
  resetPasswordExpire?: Date,
  createdAt: Date
}

const userModel = mongoose.model<IUser>('User', userSchema)

export default userModel
