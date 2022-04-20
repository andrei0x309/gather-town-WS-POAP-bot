export const teleportModel = (mongoose) => {
  const { Schema } = mongoose

  const teleportSchema = new Schema(
    {
      teleportName: {
        type: String,
        index: true,
        unique: true,
        default: ''
      },
      map: {
        type: String,
        default: ''
      },
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      },
      tokenGated: {
        type: Boolean,
        default: false
      },
      joinAlias: {
        type: String,
        default: ''
      },
      tokenContract: {
        type: String,
        default: ''
      },
      tokenAmount: {
        type: Number,
        default: 500
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    { autoIndex: false }
  )
  return mongoose.model('gb_teleports', teleportSchema)
}
