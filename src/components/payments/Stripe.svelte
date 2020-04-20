<div id="card-element">
  
</div>

<div id="card-errors" role="alert"></div>

<button id="submit">Pay</button>

<style>
   #card-element {
    width: 500px;
    background-color: #424242;
    padding: 20px;
  }
</style>
<script>
    import { onMount } from 'svelte';
    import { makeApiRequest, globalErrorHandler } from '../create-api.js';
    // Stripe
    
    export let paymentIntent;

    console.log({paymentIntent})

    const apiKey = 'STRIPE_API_KEY'

    let stripeReady = false
    let mounted = false


  
    onMount(() => {
      mounted = true;
      if (stripeReady) {
        loadStripeElements();
      }
    });
 
    function stripeLoaded() {
      stripeReady = true;
      if (mounted) {
        loadStripeElements();
      }
    }

 
    async function loadStripeElements() {
      const stripe = Stripe(apiKey);
      var elements = stripe.elements();
      var style = {
        base: {
          color: "white",
        }
      };

      var card = elements.create("card", { style: style });
      card.mount("#card-element");

      var submitButton = document.getElementById('submit');

      submitButton.addEventListener('click', function(ev) {
        console.log('here')
        stripe.confirmCardPayment(paymentIntent.client_secret, {
          payment_method: {
            card: card
          }
        }).then(function(result) {
          if (result.error) {
            alert(result.error.message);
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              alert('paid')
              makeApiRequest(`/payments/${paymentIntent.id}`, null, {
                method: 'GET'
              })
              .catch(err => {
                console.log(err.message)
              })
            }
          }
        });
      });

    }
</script>

<svelte:head>
  <script src="https://js.stripe.com/v3/" on:load={stripeLoaded}></script>
</svelte:head>