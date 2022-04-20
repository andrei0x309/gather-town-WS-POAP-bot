export const ethChallengeModel = (mongoose) => {
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
  return mongoose.model('gb_ethChallenge', ethChallengeSchema)
}
