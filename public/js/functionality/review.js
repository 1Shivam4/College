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
});
give_review.addEventListener('click', () => {
  write_review.classList.add('display');
  // review.classList.remove('display');
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

document.getElementById('give_review').addEventListener('click', function () {
  const div1 = document.getElementById('review_list');
  const div2 = document.getElementById('write_review');

  // Get the parent nodes
  const parent1 = review_list.parentNode;

  const parent2 = write_review.parentNode;

  // Get the next sibling of div1
  const nextSibling1 = review_list.nextSibling;

  // Swap the positions
  parent2.insertBefore(review_list, write_review);
  parent1.insertBefore(write_review, nextSibling1);
});
