const mainSchema = {
  email: {
    type: 'string'
  },
  password: {
    type: 'string'
  },
  gatherSpace: {
    type: 'string'
  },
  apiKey: {
    type: 'string'
  },
  backendHostname: {
    type: 'string'
  },
  polygonScanApiKey: {
    type: 'string'
  },
  dbType: {
    type: 'string',
    default: 'mongodb'
  },
  dbConnectionString: {
    type: 'string'
  },
}

export { mainSchema }
