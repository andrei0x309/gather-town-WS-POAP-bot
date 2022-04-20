export const ethLinksModel = (mongoose) => {
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
  return mongoose.model('gb_ethLinks', ethLinksSchema)
}
