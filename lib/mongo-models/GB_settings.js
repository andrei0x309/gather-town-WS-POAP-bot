export const settingsModel = (mongoose) => {
  const { Schema } = mongoose

  const settingsSchema = new Schema(
    {
      authUsers: {
        type: 'array',
        default: []
      },
      autoConnect: {
        type: 'boolean',
        default: false
      }
    },
    { autoIndex: false }
  )
  return mongoose.model('gb_settings', settingsSchema)
}
