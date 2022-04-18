import mongoose from 'mongoose'

const { Schema } = mongoose

const logsSchema = new Schema(
  {
    date: {
      type: String,
      index: true,
      unique: true
    },
    logs: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { autoIndex: false }
)
export const logs = mongoose.model('gb_logs', logsSchema)
