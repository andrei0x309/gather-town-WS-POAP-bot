export const poapLinksModel = (mongoose) => {
  const { Schema } = mongoose

  const poapLinksSchema = new Schema(
    {
      url: {
        type: String,
        index: true,
        default: ''
      },
      used: {
        type: Boolean,
        default: false
      },
      user: {
        type: String,
        index: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    { autoIndex: false }
  )
  return mongoose.model('gb_poapLinks', poapLinksSchema)
}
