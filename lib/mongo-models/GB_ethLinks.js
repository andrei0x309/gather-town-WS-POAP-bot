import mongoose from 'mongoose'

const { Schema } = mongoose

const ethLinksSchema = new Schema(
  {
    user: {
      type: String,
      index: true,
      unique: true
    },
    address: {
      type: String,
      index: true
    }
  },
  { autoIndex: false }
)
export const ethLinks = mongoose.model('gb_ethLinks', ethLinksSchema)
