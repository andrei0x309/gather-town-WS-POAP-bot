const ethLinksSchema = {
  users: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        user: {
          type: 'string'
        },
        address: {
          type: 'string'
        }
      }
    }
  }
}

export { ethLinksSchema }
