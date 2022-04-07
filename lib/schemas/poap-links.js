const poapLinks = {
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
        }
      }
    }
  }
}

export { poapLinks }
