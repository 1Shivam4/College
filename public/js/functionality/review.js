/* eslint-disable */
const det = document.getElementById('det');
const rev = document.getElementById('rev');
const give_review = document.getElementById('give_review');

const detail = document.getElementById('detail');
const review = document.getElementById('review');
const write_review = document.getElementById('write_review');

det.addEventListener('click', () => {
  detail.classList.remove('display-none');

  detail.classList.add('display');
  review.classList.remove('display');
  write_review.classList.remove('display');
});
rev.addEventListener('click', () => {
  review.classList.add('display');
  detail.classList.add('display-none');
  write_review.classList.remove('display');
});
give_review.addEventListener('click', () => {
  write_review.classList.add('display');
  review.classList.remove('display');
  detail.classList.remove('display');
});

// quantity increase and decrease
function decreaseQuantity() {
  var input = document.querySelector('.quantity-input');
  var value = parseInt(input.value, 10);
  if (value > 0) {
    input.value = value - 1;
  }
}
function increaseQuantity() {
  var input = document.querySelector('.quantity-input');
  var value = parseInt(input.value, 10);
  input.value = value + 1;
}
