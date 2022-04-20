const ethChallengeSchema = {
  challenges: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        code: {
          type: 'string'
        },
        message: {
          type: 'string'
        },
        expire: {
          type: 'number'
        }
      }
    }
  }
}

export { ethChallengeSchema }
