import { globalError } from '../store.js'

async function makeApiRequest(url, payload = null, opts = {}) {
  let myUrl = `API_BASE_URL${url}`
  const options = {};

  options.method = opts.method || 'POST';

  if (payload) {
    const len = Object.keys(payload).length;

    if (options.method === 'GET') {
      myUrl += len ? '?' : '';

      Object.keys(payload).forEach(key => {
        myUrl += `${key}=${payload[key]}${len - 1 > 0 ? '&' : ''}`;
      });

      console.log(myUrl);
    } else {
      console.log('e')
      options.body = JSON.stringify(payload);
    }
  }

  options.headers = {
    ...opts.headers,
    ...(opts.noauth ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` }),
    'Content-type': 'application/json',
  };

  if (opts.mode) {
    options.mode = opts.mode;
  }

  return fetch(myUrl, options)
    .then(async res => {
      if (!res.ok) {
        const err = await res.json();
        throw JSON.stringify(err.errors) || res.statusText;
      }

      return opts.raw ? res.text() : res.json();
    })
    .catch(err => {
      throw new Error(err);
    });
}

async function globalErrorHandler(msg) {
  globalError.set(msg)
}

export {
  makeApiRequest,
  globalErrorHandler,
}