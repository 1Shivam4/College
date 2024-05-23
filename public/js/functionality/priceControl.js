/* eslint-disable */
// Get the quantity input element and buttons
var quantityInput = document.getElementById('quantity-input');
var increaseButton = document.querySelector('.quantity-button.increase');
var decreaseButton = document.querySelector('.quantity-button.decrease');
var priceDisplay = document.getElementById('price-display');

// Get the original price of the product
var originalPrice = parseInt(priceDisplay.textContent);

// Function to increase quantity
function increaseQuantity() {
  var quantity = parseInt(quantityInput.value);
  quantity++;
  quantityInput.value = quantity;
  updatePrice(quantity);
}

// Function to decrease quantity
function decreaseQuantity() {
  var quantity = parseInt(quantityInput.value);
  if (quantity > 1) {
    quantity--;
    quantityInput.value = quantity;
    updatePrice(quantity);
  }
}

// Add event listeners to the buttons
increaseButton.addEventListener('click', increaseQuantity);
decreaseButton.addEventListener('click', decreaseQuantity);

// Function to update the price based on the quantity
function updatePrice(quantity) {
  var totalPrice = originalPrice * quantity;
  // Update the displayed price
  priceDisplay.textContent = totalPrice;
}
