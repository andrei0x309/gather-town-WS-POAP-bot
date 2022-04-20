const teleportSchema = {
  teleports: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        teleportName: {
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
        joinAlias: {
          type: 'string',
          default: ''
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
