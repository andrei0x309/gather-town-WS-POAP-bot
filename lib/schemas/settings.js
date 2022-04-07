const settingsSchema = {
  announceEnabled: {
    type: 'boolean',
    default: true
  },
  authUsers: {
    type: 'array',
    default: []
  },
  poapLogsEnabled: {
    type: 'boolean',
    default: true
  },
  autoConnect: {
    type: 'boolean',
    default: true
  }
}

export { settingsSchema }
