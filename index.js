'use strict';

(function() {
  const URL = 'http://localhost:7000';
  let HANDLES = [];
  const T_SPEED = 1000;
  const DELAY = 4000;
  let timeoutHandle;
  const TEAM_IMAGE_DURATION = 30000;
  let fullRocket = false;

  window.addEventListener('load', init);
  
  function init() {
    initSlideshow();
    document.addEventListener('scroll', handleScroll);
    console.log('Slideshow initialized successfully');
  }

  /**
   * SLIDESHOW
   */

  async function initSlideshow() {
    let images = await fetch(URL + '/slideshowAssets');
    images = await statusCheck(images);
    images = await images.json();
    images = images.slideshowImg;
    let parent = qs('#slideshow div');
    appendImages(parent, images, 'ssUpper');
    appendImages(parent, images, 'ssLower');
    let ssImages = qsa('#slideshow div img');
    for (let i = 1; i < ssImages.length; i++) {
      ssImages[i].classList.add('hidden');
    }
    playSlideshow(0, 1);
  }

  function appendImages(parent, images, className) {
    for (let i = 0; i < images.length; i++) {
      let img = gen('img');
      img.src = '/assets/slideshow/' + images[i];
      let alt = images[i].replace('.', '-');
      img.alt = alt;
      img.classList.add(alt);
      img.classList.add(className);
      HANDLES.push(alt);
      parent.appendChild(img);
    }
  }

  function playSlideshow(currentIndex, targetIndex) {
    let currentImg = HANDLES[currentIndex];
    if (targetIndex >= HANDLES.length) {
      targetIndex = targetIndex - HANDLES.length;
    }
    let targetImg = HANDLES[targetIndex];
    let targetUpperHandle = '.' + targetImg + '.ssUpper';
    let targetLowerHandle = '.' + targetImg + '.ssLower';
    let currentHandle = '.' + currentImg + '.ssUpper';
    let targetUpper = qs(targetUpperHandle);
    let targetLower = qs(targetLowerHandle);
    let current = qs(currentHandle);
    targetLower.classList.remove('hidden');
    targetUpper.classList.remove('hidden');
    timeoutHandle = setTimeout(() => {
      current.classList.add('hidden');
      targetLower.classList.add('hidden');
      timeoutHandle = setTimeout(() => {
        playSlideshow(targetIndex, targetIndex + 1);
      }, DELAY);
    }, T_SPEED);
  }

  /**
   * ROCKET
   */

  function toggleFullRocket() {
    const images = qsa('#rockets img');
    const full = images[0];
    const wire = images[1];
    full.classList.toggle('opaque');
    wire.classList.toggle('opaque');
    full.classList.toggle('transparent');
    wire.classList.toggle('transparent');
    if (fullRocket) {
      fullRocket = false;
    } else {
      fullRocket = true;
    }
  }

  /**
   * HELPER FUNCTIONS
   */

  function handleScroll() {
    const body = qs('body');
    const scrollPx = document.body.parentNode.scrollTop;
    const windowHeight = window.innerHeight;
    let vhDown = scrollPx / windowHeight;
    if (vhDown > 0.9 && fullRocket == false) {
      toggleFullRocket();
    } else if (vhDown < 1 && fullRocket == true) {
      toggleFullRocket();
    }
    console.log(isInViewport(qs('#rockets h2')));
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

  async function statusCheck(data) {
    if (!data.ok) {
      throw new Error(await data.text());
    }
    return data;
  }

  function gen(type) {
    return document.createElement(type);
  }

  function qs(target) {
    return document.querySelector(target);
  }

  function qsa(target) {
    return document.querySelectorAll(target);
  }
})();