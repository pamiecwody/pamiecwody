function resize(haxx) {
  var bodyElement = document.body;

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  var bodyWidth = bodyElement.offsetWidth;
  var bodyHeight = bodyElement.offsetHeight;

  var scaleWidth = windowWidth / bodyWidth;
  var scaleHeight = windowHeight / bodyHeight;

  var scale = Math.min(scaleWidth, scaleHeight);

  var scaledWidth = scale * bodyWidth;
  var scaledHeight = scale * bodyHeight;

  bodyElement.style['transform'] = 'scale(' + scale + ')';

  var bodyBoundingRect = bodyElement.getBoundingClientRect();
  var bodyBoundingRectWidth = bodyBoundingRect.width;
  var bodyBoundingRectHeight = bodyBoundingRect.height;

  var xOffset = -(bodyWidth - bodyBoundingRectWidth) / 2 + (windowWidth - scaledWidth) / 2;
  var yOffset = -(bodyHeight - bodyBoundingRectHeight) / 2 + (windowHeight - scaledHeight) / 2;

  if (bodyBoundingRect.x === 0 && !haxx) {
    resize(true);
  }

  //bodyElement.style['margin'] = '0';
  bodyElement.style['transform'] = 'translateX(' + xOffset + 'px) translateY(' + yOffset + 'px) scale(' + scale + ')';
}

function getCurrentSlideFileName() {
  var path = window.location.pathname;
  var pathSplit = path.split("/");
  return pathSplit.pop();
}

function getCurrentSlideIndex() {
  return Number.parseInt(getCurrentSlideFileName().match(/(\d+)\.xhtml$/));
}

function getSlideFileNameForIndex(slideIndex) {
  return window.location.pathname.replace(/(\d+)\.xhtml$/, slideIndex + '.xhtml');
}

function switchSlide(offset) {
  var newIndex = getCurrentSlideIndex() + offset;
  if (slideExist(newIndex)) {
    window.open(getSlideFileNameForIndex(newIndex), '_self');
  }
}

function slideExist(slideIndex) {
  return slideIndex > 0 && slideIndex <= 77;
}

function addHamburgerMenu() {
  var button = document.createElement('button');
  button.style['position'] = 'absolute';
  button.style['top'] = '10px';
  button.style['left'] = '10px';
  button.style['background-color'] = '#777';
  button.style['color'] = 'white';
  button.style['cursor'] = 'pointer';
  button.style['padding'] = '5px';
  button.style['width'] = '30px';
  button.style['border'] = 'none';
  button.style['border-radius'] = '3px';
  button.style['text-align'] = 'center';
  button.style['outline'] = 'none';
  button.style['font-size'] = '15px';
  button.innerText = '☰';

  document.body.parentElement.appendChild(button);
}

document.onkeyup = function (e) {
  e = e || window.event;
  switch (e.keyCode) {
    case 13: // enter 
    case 32: // space bar
    case 34: //page down
    case 39: //arrow right
    case 40: // arrow down
      switchSlide(1);
      break;
    case 33: // page up
    case 37: // arrow left
    case 38: // arrow up
      switchSlide(-1);
      break;
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  var body = document.body;
  body.style['display'] = 'none';
  body.style['overflow-x'] = 'hidden';
  var currentSlideIndex = getCurrentSlideIndex();
  if (currentSlideIndex != 12 && currentSlideIndex != 52 && currentSlideIndex != 54) {
    body.style['overflow-y'] = 'hidden';
  }
});

window.addEventListener('load', function (event) {
  document.body.style['display'] = '';
  resize(false);
  window.scrollTo(0, 0);
  addHamburgerMenu();
});
window.addEventListener('resize', function (event) {
  resize(false);
});