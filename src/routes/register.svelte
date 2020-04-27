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

  const register = async (event) => {
    event.preventDefault()
    const form = document.getElementById('register')
    const formData = new FormData(form)
    form.reset()

    const url = '/register'
    const res = await makeApiRequest(url, {
      username: formData.get('username'),
      password: formData.get('password')
    },
    { method: 'POST' })
      .catch(err => globalErrorHandler(err))

    const { token } = res

    try {
      userStore.update(() => decode(token).user)
      localStorage.setItem('token', token)
    } catch (error) {
      console.log(error)
    }

    return goto('/')
  }
</script>

<style>
  .signup {
    width: 300px;
  }
  @media only screen and (max-width: 800px) {
    .signup {
      width: 100%;
    }
  }
</style>

<form class="signup" id="register">
  <fieldset>
    <input type="text" placeholder="Username" id="username" name="username">
    <input type="password" placeholder="Password" id="password" name="password">
    <input type="password" placeholder="Confirm Password" id="confirmPassword" name="confirmPassword">
    <button class="button-primary float-right" type="submit" on:click={ register }>Signup</button>
  </fieldset>
</form>
