async function postData(url = '', data = {}, headers = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  })
  return response
}

async function getData(url = '', headers = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })
  return response
}

export { postData, getData }
