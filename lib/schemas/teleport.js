const teleportSchema = {
  teleports: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        map: {
          type: 'string'
        },
        x: {
          type: 'number'
        },
        y: {
          type: 'number'
        },
        tokenGated: {
          type: 'boolean',
          default: false
        },
        tokenContract: {
          type: 'string',
          default: ''
        },
        tokenAmount: {
          type: 'number',
          default: 500
        }
      }
    }
  }
}

export { teleportSchema }
