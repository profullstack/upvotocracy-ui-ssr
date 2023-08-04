<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '../store';
  import decode from 'jwt-decode';
  import { makeApiRequest, globalErrorHandler } from '../api/create-api';

  export let type = 'login';
  let user;

  userStore.subscribe((value) => {
    user = value;
  });

  onMount(() => {
    if (user) goto('/');
  });

  const login = async () => {
    const form = document.getElementById('login');
    const formData = new FormData(form);
    form.reset();

    const url = '/login';
    const res = await makeApiRequest(
      url,
      {
        username: formData.get('username'),
        password: formData.get('password'),
      },
      { method: 'POST' },
    ).catch((err) => globalErrorHandler(err));

    if (!res) return;

    const { token, user } = res;

    try {
      console.log(user, token);
      userStore.set(user);
      localStorage.setItem('token', token);
    } catch (error) {
      console.log(error);
    }

    return goto('/');
  };

  const register = async () => {
    const form = document.getElementById('login');
    const formData = new FormData(form);
    form.reset();

    const url = '/register';
    const res = await makeApiRequest(
      url,
      {
        username: formData.get('username'),
        password: formData.get('password'),
      },
      { method: 'POST' },
    ).catch((err) => globalErrorHandler(err));

    if (!res) return;

    const { token } = res;

    try {
      userStore.update(() => decode(token).user);
      localStorage.setItem('token', token);
    } catch (error) {
      console.log(error);
    }

    return goto('/');
  };

  const submit = () => {
    if (type == 'login') login();
    else if (type == 'register') register();
  };
</script>

<form class="login" id="login">
  <fieldset>
    <input class="input" type="text" placeholder="Username" id="username" name="username" />
    <input class="input" type="password" placeholder="Password" id="password" name="password" />
    {#if type == 'register'}
      <input
        class="input"
        type="password"
        placeholder="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
      />
    {/if}
    <button class="btn-lrg" type="submit" on:click|preventDefault={submit}>{type}</button>
  </fieldset>
</form>

<style>
  .login {
    max-width: 300px;
  }
  fieldset {
    border: none;
  }
  fieldset > * {
    margin: 10px;
  }
  @media only screen and (max-width: 800px) {
    .login {
      width: 100%;
    }
  }
</style>
