<div id="card-element">
  
</div>

<div id="card-errors" role="alert"></div>

<button id="submit">Pay</button>

<style>
   #card-element {
    max-width: 500px;
    background-color: white;
    padding: 20px;
    border-width: 1px;
    border-color: #c2c2c2;
    background-color: #f0f0f0;
    border-style: solid;
    margin-bottom: 1rem;
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
          color: "black",
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
              makeApiRequest(`/payments`, {
                id: paymentIntent.id
              }, {
                method: 'POST'
              })
              .catch(err => { globalErrorHandler(err) })
            }
          }
        });
      });

    }
</script>

<svelte:head>
  <script src="https://js.stripe.com/v3/" on:load={stripeLoaded}></script>
</svelte:head>