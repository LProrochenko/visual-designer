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
const modal = document.querySelector('.modal');
const btnContactFormSubmit = document.querySelector(
  '.contact-form__submit-btn'
);
const btnModalSubmit = document.querySelector('.modal__submit-btn');
const btnModalClose = document.querySelector('.modal__close-btn');
const contactForm = document.querySelector('.contact-form');
const spinner = document.querySelector('.spinner');
const modalContent = document.querySelector('.modal__content');

///Sticky navigation
const headerHeight = header.getBoundingClientRect().height || 0;
const getStickyHeader = ([entry]) => {
  //console.log(entry);

  header.classList.toggle('sticky', !entry.isIntersecting);
};

const headerObserver = new IntersectionObserver(getStickyHeader, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});
headerObserver.observe(introInfo);

////Slider
let currentSlide = 0;
const totalSlides = slides.length;

const moveToSlide = (slideIndex) => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slideIndex) * 100}%)`;
  });
};

const nextSlide = () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlide();
};

const previousSlide = () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlide();
};

const createDots = () => {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide = ${index}></button>`
    );
  });
};

const activateCurrentDot = slide => {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.toggle('dots__dot-active', dot.dataset.slide == currentSlide);
  });
};

const updateSlide = () => {
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

createDots();
updateSlide();

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

    const image = entry.target;
    image.src = image.dataset.src;

    image.addEventListener('load', () => {
      image.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  });
};

const lazyImagesObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0.1,
});

lazyImages.forEach(image => lazyImagesObserver.observe(image));

//// Smooth page navigation
document.querySelector('.header__list').addEventListener('click', e => {
  e.preventDefault();

  const targetLink = e.target.closest('.header__link');

  if (!targetLink) return;

  const href = targetLink.getAttribute('href');
  const targetElement = document.querySelector(href);

  if (!targetElement) return;

  const isSticky = header.classList.contains('sticky');
  const offset = isSticky ? 80 : headerHeight + 80;
  const targetPosition = targetElement.offsetTop - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
});

////Smooth appearance of section
const handleSectionAppearance = ([entry], observer) => {
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section-hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(handleSectionAppearance, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section-hidden');
});

//// Page scroll
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  footer.scrollIntoView({ behavior: 'smooth' });
});

////Navigation links hover effect
// Utility function to adjust opacity for the links and logo
const changeOpacity = (target, opacityValue) => {
  const logo = target.closest('.header').querySelector('img');
  const siblingLinks = target
    .closest('.header__nav')
    .querySelectorAll('.header__link');

  siblingLinks.forEach(link => {
    if (link !== target) {
      link.style.opacity = opacityValue;
    }
  });

  logo.style.opacity = opacityValue;
};

// Navigation links hover animation effect
const navLinksHoverAnimation = e => {
  if (e.target.classList.contains('header__link')) {
    const opacityValue = e.type === 'mouseover' ? 0.4 : 1;
    changeOpacity(e.target, opacityValue);
  }
};

// Event listeners for hover effects
header.addEventListener('mouseover', navLinksHoverAnimation);
header.addEventListener('mouseout', navLinksHoverAnimation);

//// Modal window
// Utility function to toggle class visibility
const toggleVisibility = (element, className, action) => {
  element.classList[action](className);
};

// Reset the contact form
const resetForm = () => {
  if (contactForm) {
    contactForm.reset();
  }
};

// Handle form submission
const handleSubmitForm = e => {
  e.preventDefault();

  toggleVisibility(modal, 'hidden', 'remove');
  toggleVisibility(spinner, 'hidden', 'remove');
  resetForm();

  setTimeout(() => {
    toggleVisibility(spinner, 'hidden', 'add');
    toggleVisibility(modalContent, 'hidden', 'remove');
  }, 1500);
};

// Close modal window
const closeModalWindow = () => {
  toggleVisibility(modal, 'hidden', 'add');
  toggleVisibility(modalContent, 'hidden', 'add');
};

// Event listeners
contactForm.addEventListener('submit', handleSubmitForm);
btnModalClose.addEventListener('click', closeModalWindow);
btnModalSubmit.addEventListener('click', closeModalWindow);
window.addEventListener('click', function (e) {
  if (e.target === modal) {
    closeModalWindow();
  }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModalWindow();
  }
});
