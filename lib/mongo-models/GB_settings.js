import mongoose from 'mongoose'

const { Schema } = mongoose

const settingsSchema = new Schema(
  {
    authUsers: {
      type: 'array',
      default: []
    }
  },
  { autoIndex: false }
)
export const settings = mongoose.model('gb_settings', settingsSchema)
