/* eslint-disable */

function slider(slideItem, slide, prev, next) {
  document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll(slideItem);
    const slider = document.querySelector(slide);
    const prevBtn = document.querySelector(prev);
    const nextBtn = document.querySelector(next);

    let currentSlideIndex = 0;
    let intervalId = null;

    function showSlide(index) {
      slides.forEach((slide) => slide.classList.remove('current-slide'));
      slides[index].classList.add('current-slide');
      slider.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(currentSlideIndex);
    }

    function prevSlide() {
      currentSlideIndex =
        (currentSlideIndex - 1 + slides.length) % slides.length;
      showSlide(currentSlideIndex);
    }

    function startSlider() {
      intervalId = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    }

    function stopSlider() {
      clearInterval(intervalId);
    }

    prevBtn.addEventListener('click', function () {
      prevSlide();
      stopSlider(); // Stop automatic sliding when user interacts with controls
    });

    nextBtn.addEventListener('click', function () {
      nextSlide();
      stopSlider(); // Stop automatic sliding when user interacts with controls
    });

    startSlider();
  });
}

slider('.slider-item', '.slider', '.prev-btn', '.next-btn');
slider('.testimonial-slider-item ', '.slider-1', '.prev-btn', '.next-btn');
