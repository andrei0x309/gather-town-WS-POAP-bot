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
        }
      }
    }
  }
}

export { teleportSchema }
