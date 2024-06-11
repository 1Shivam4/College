import axios from 'axios';
import { showAlert } from './alerts';
import { uploadProduct } from './upload';

const productBtn = document.querySelector('.buy_now');
const reviewForm = document.getElementById('review_form');
const uploadForm = document.getElementById('product');
console.log(uploadForm);

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
        url: `/api/v1/payment/order/${productId}`,
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
              `/api/v1/payment/verify/${productId}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            alert(
              verificationResponse.data.response.message,
              'Verification Successful'
            );
          } catch (err) {
            console.error('Verification Failed', err.message);
            alert(response);
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
if (reviewForm) {
  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post('/api/v1/review', data);

      if (response.data.status === 'Success') {
        showAlert('success', 'Thanks for the review');
        setTimeout(() => {
          window.location.href = response.data.redirectUrl;
        }, 2000);
      } else {
        showAlert('error', response.data.message); // Use showAlert for consistency
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      showAlert('error', 'Please login!');
    }
  });
}

if (uploadForm) {
  uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('price', document.getElementById('price').value);
    form.append('description', document.getElementById('description').value);
    form.append('imageCover', document.getElementById('imageCover').files[0]);

    const images = document.getElementById('images').files;
    for (let i = 0; i < images.length; i++) {
      form.append('images', images[i]);
    }

    form.append('category', document.getElementById('category').value);

    document.getElementById('submitForm').textContent = 'processing...';
    uploadProduct(form);

    uploadForm.reset();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const deleteLinks = document.querySelectorAll('.delete');
  deleteLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const productId = this.getAttribute('data-id');
      deleteProduct(productId);
    });
  });
});

function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    axios
      .delete(`/api/v1/product/${productId}`)
      .then((response) => {
        if (response.status === 200) {
          alert('Product deleted');
          // Optionally, remove the item from the DOM or refresh the page
          location.reload(); // Reloads the page to reflect the changes
        } else {
          alert('Failed to delete product');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  }
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

  if (alertParam === 'review-failed') {
    alert(
      "You havn't purchased the product. Please purchase the product first."
    );
  }

  // if (alertParam === 'review-success') {
  //   alert('Thanks for the review.');
  // }
});
