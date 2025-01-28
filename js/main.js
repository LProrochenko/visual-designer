'use strict';

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn-left');
const btnRight = document.querySelector('.slider__btn-right');
const dotContainer = document.querySelector('.dots');
const lazyImages = document.querySelectorAll('img[data-src]');


//Slider
let currentSlide = 0;
const slideNumber = slides.length;

const moveToSlide = function (slide) {
  slides.forEach((s, index) => {
    s.style.transform = `translateX(${(index - slide) * 100}%)`;
  });
};

const nextSlide = function () {
  if (currentSlide === slideNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slideNumber - 1;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

const createDots = function () {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide = ${index}></button>`
    );
  });
};

const activateCurrentDot = function (slide) {
   document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot-active'));
   document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot-active');
};

moveToSlide(0);
createDots();
activateCurrentDot(0);

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') previousSlide();
});
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slideNumber = e.target.dataset.slide;
    moveToSlide(slideNumber);
    activateCurrentDot(slideNumber);
  }
});
///Lazy loading
const loadImage = function (entries, observer) {
  entries.forEach(entry =>{
    if(!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
    });
};

const lazyImagesObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0.7,
});

lazyImages.forEach(image => lazyImagesObserver.observe(image));
