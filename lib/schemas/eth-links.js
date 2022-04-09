const ethLinksSchema = {
  users: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
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
