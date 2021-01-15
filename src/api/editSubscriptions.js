import { userStore } from '../store'
import { makeApiRequest, globalErrorHandler } from './create-api'

let user;
userStore.subscribe(value => {
  user = value
})

const addSubscription = async (id) => {
  const url = `/me/subscriptions/${id}`

  const res = await makeApiRequest(url, null, { method: 'POST', raw: true })
    .catch(err => globalErrorHandler(err))

  user.subscriptions.push(id)
  userStore.set(user);
}

const removeSubscription = async (id) => {
  const url = `/me/subscriptions/${id}`
  
  const res = await makeApiRequest(url, null, { method: 'DELETE', raw: true })
    .catch(err => globalErrorHandler(err))

  const index = user.subscriptions.findIndex(i => i == id);
  user.subscriptions.splice(index, 1);
  userStore.set(user);
}

export {
  addSubscription,
  removeSubscription,
}