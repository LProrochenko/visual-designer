'use strict';
const introInfo = document.querySelector('.intro__info');
const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn-left');
const btnRight = document.querySelector('.slider__btn-right');
const dotContainer = document.querySelector('.dots');
const lazyImages = document.querySelectorAll('img[data-src]');
const allSections = document.querySelectorAll('.section');
const btnScrollTo = document.querySelector('.button_scroll-to');
const footer = document.querySelector('.footer');

///Sticky navigation
const headerHeight = header.getBoundingClientRect().height || 0;
const getStickyHeader = function (entries) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(getStickyHeader, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});
headerObserver.observe(introInfo);

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
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot-active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot-active');
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
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
};

const lazyImagesObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0.1,
});

lazyImages.forEach(image => lazyImagesObserver.observe(image));

// Smooth page navigation
document.querySelector('.header__list').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('header__link')) {
    const href = e.target.getAttribute('href');
    const targetElement = document.querySelector(href);

    if (targetElement) {
      const targetPosition =
        window.scrollY === 0
          ? targetElement.offsetTop - headerHeight - 80
          : targetElement.offsetTop - 80;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }
});

// Smooth appearance of section
const appearanceSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section-hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.4,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section-hidden');
});

// Page scroll
btnScrollTo.addEventListener('click', function (e) {
  footer.scrollIntoView({ behavior: 'smooth' });
});

// Navigation links hover animation effect
const  navLinksHoverAnimation = function (e) {
  if (e.target.classList.contains('header__link')) {
    const linkOver = e.target;
    const logo = linkOver.closest('.header').querySelector('img');
    const siblingLinks = linkOver
      .closest('.header__nav')
      .querySelectorAll('.header__link');
    siblingLinks.forEach(el => {
      if (el !== linkOver) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
}
header.addEventListener('mouseover', navLinksHoverAnimation.bind(0.4));
header.addEventListener('mouseout', navLinksHoverAnimation.bind(1));

