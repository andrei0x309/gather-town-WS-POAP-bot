import mongoose from 'mongoose'

const { Schema } = mongoose

const ethChallengeSchema = new Schema(
  {
    _id: String,
    code: {
      type: String,
      index: true
    },
    message: {
      type: String
    },
    expire: {
      type: Date,
      default: Date.now,
      expires: '1200'
    }
  },
  { autoIndex: false }
)
export const ethChallenge = mongoose.model('gb_ethChallenge', ethChallengeSchema)
