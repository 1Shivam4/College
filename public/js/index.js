import axios from 'axios';

const productBtn = document.querySelector('.buy_now');

if (productBtn) {
  productBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const productId = productBtn.getAttribute('data-product-id');

    if (!productId) {
      console.error('Product not found');
      return;
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `https://dizzee-ecommerce-108b790591a0.herokuapp.com/api/v1/payment/order/${productId}`,
      });

      const order = response.data.order; // Accessing the order object

      const options = {
        key: 'rzp_test_OujR7IvNQMnXtc', // Replace with your Razorpay key ID

        currency: order.currency,
        name: order.notes.name,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              `https://dizzee-ecommerce-108b790591a0.herokuapp.com/api/v1/payment/verify/${productId}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            alert(
              verificationResponse.data.response,
              'Verification Successful'
            );
          } catch (err) {
            console.error('Verification Failed', err);
            alert('Verification Failed');
          }
        },
        theme: {
          color: '#2dba52',
        },
        method: {
          upi: true,
          paylater: false,
        },
        modal: {
          ondismiss: function () {
            console.log('Checkout form closed');
          },
          escape: false,
        },
      };

      console.log(options);
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const alertParam = urlParams.get('alert');

  if (alertParam === 'success') {
    alert('Item added to your cart');
  } else if (alertParam === 'failure') {
    alert('Item already exists in the cart');
  }

  if (alertParam === 'not-loggedIn') {
    alert('You are not logged In! Please log in first');
  }
  if (alertParam === 'loggedOut') {
    alert('Successfully logged out');
  }

  if (alertParam === 'login-success') {
    alert('Successfully logged in');
  }
});
