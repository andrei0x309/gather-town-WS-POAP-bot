const poapLinksSchema = {
  links: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        url: {
          type: 'string'
        },
        used: {
          type: 'boolean'
        },
        user: {
          type: 'string'
        }
      }
    }
  }
}

export { poapLinksSchema }
