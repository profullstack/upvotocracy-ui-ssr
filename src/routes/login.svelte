<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import { userStore } from '../store'
  import decode from 'jwt-decode'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  let user
  userStore.subscribe(value => {
    user = value
  })

  onMount(() => {
    if (user) goto('/')
  })

  const login = async (event) => {
    event.preventDefault()
    const form = document.getElementById('login')
    const formData = new FormData(form)
    form.reset()

    const url = '/login'
    const res = await makeApiRequest(url, {
      username: formData.get('username'),
      password: formData.get('password')
    },
    { method: 'POST' })
      .catch(err => globalErrorHandler(err))

    if (!res) return

    const { token, user } = res

    try {
      console.log(user, token);
      userStore.set(user)
      localStorage.setItem('token', token)
    } catch (error) {
      console.log(error)
    }

    return goto('/')
  }
</script>

<style>
  .login {
    width: 300px;
  }
  @media only screen and (max-width: 800px) {
    .login {
      width: 100%;
    }
  }
</style>

<form class="login" id="login">
  <fieldset>
    <input type="text" placeholder="Username" id="username" name="username">
    <input type="password" placeholder="Password" id="password" name="password">
    <button class="button-primary float-right" type="submit" on:click={ login }>Login</button>
  </fieldset>
</form>
