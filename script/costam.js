var scrollableSlides = [12, 45, 61, 63];

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

function addCssStyle(css) {
  var element = document.querySelector('style');
  if (!element) {
    element = document.createElement('style');
    element.type = 'text/css';
    document.querySelector('head').appendChild(element);
  }
  element.innerHTML += '\n' + css.trim() + '\n';
}

function getCurrentSlideFileName() {
  var path = window.location.pathname;
  var pathSplit = path.split("/");
  return pathSplit.pop();
}

function getCurrentSlideIndex() {
  return parseInt(getCurrentSlideFileName().match(/(\d+)\.xhtml$/));
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
  return slideIndex > 0 && slideIndex <= 86;
}

function createElement(parentElement, tagName) {
  var element = document.createElement(tagName);
  parentElement.appendChild(element);
  return element;
}


function isLocal() {
  if (window.location.href.match('.*/dev/.*')) {
    return false; //dev mode
  }
  return window.location.href.startsWith('file');
}

function createHamburgerButton(menu) {
  var button = createElement(document.body.parentElement, 'button');
  button.className = 'hamburgerButton';
  button.innerText = '☰';

  menu.style['visibility'] = 'hidden'
  menu.style['opacity'] = '0'
  menu.style['transition'] = 'visibility 0.1s linear, opacity 0.1s linear';
  button.addEventListener("click", function () {
    if (menu.style['opacity'] == '0') {

      menu.style['visibility'] = '';
      menu.style['opacity'] = '1';
    }
    else {
      menu.style['opacity'] = '0';
      menu.style['visibility'] = 'hidden';
    }
  });
}

function createMenu() {
  var menu = createElement(document.body.parentElement, 'div');
  menu.className = 'sideMenu';
  menu.style['visibility'] = 'hidden';
  menu.style['opacity'] = '0';
  createHamburgerButton(menu);
  return menu;
}

function addMenuHeader(menuElement, text) {
  var header = createElement(menuElement, 'p');
  header.className = 'menuHeader';
  header.innerText = text;
}

function addMenuFooter(menuElement, name, year) {
  var footer = createElement(menuElement, 'p');
  footer.className = 'menuFooter';
  footer.innerText = name;
}

function addMenuItem(menuElement, text, url) {
  var menuItem = createElement(menuElement, 'p');
  if (url !== undefined) {
    var link = createElement(menuItem, 'a');
    link.href = url;
    link.innerText = text;
  } else {
    menuItem.innerText = text;
  }
  return menuItem;
}

function addSideMenu() {
  var menu = createMenu();
  addMenuHeader(menu, 'pamięć wody');
  addMenuItem(menu, 'start', getSlideFileNameForIndex(1));
  addMenuItem(menu, 'sieci dróg wodnych w Europie', getSlideFileNameForIndex(3));
  addMenuItem(menu, 'Kanał Mazurski', getSlideFileNameForIndex(10));
  addMenuItem(menu, 'historia i tożsamość', getSlideFileNameForIndex(25));
  addMenuItem(menu, 'analiza dostępności', getSlideFileNameForIndex(32));
  addMenuItem(menu, 'analiza percepcyjna', getSlideFileNameForIndex(37));
  addMenuItem(menu, 'architektura pogranicza', getSlideFileNameForIndex(43));
  addMenuItem(menu, 'wnioski', getSlideFileNameForIndex(50));
  addMenuItem(menu, 'szlak turystyki angażującej', getSlideFileNameForIndex(59));
  addMenuItem(menu, 'kontakt', getSlideFileNameForIndex(86));
}


function setPageTitle() {
  document.title = 'Pamięć wody';
}

function createCssStyles() {
  addCssStyle(`
.hamburgerButton {
  position: fixed;
  font-size: 24px;
  top: 5px;
  left: 5px;
  background-color: rgb(255, 255, 255, 0.0);
  cursor: pointer;
  padding: 5px; 
  width: 30px;
  border: none;
  text-align: center;
  outline: none;
  z-index: 1;
}

.menuFooter {
  position: fixed;
  bottom: 0px;
  left: 0px;
  font-family: Myriad Pro;
  font-weight: light;
  font-size: 22px;
}

.menuHeader {
  position: fixed;
  font-family: Frank Ruhl Libre Black;
  font-size: 22px;
  top: 0px;
  left: 0px;
  width: 240px;
  height: 45px;
  line-height: 32px;
  padding: 10px 10px 0px 50px; 
  background-color: rgb(0, 0, 0, 0.1);
  border-right: 1px solid rgb(180, 180, 180, 1.0);
  border-bottom: 1px solid rgb(180, 180, 180, 1.0);
  z-index: 1;
}

.sideMenu {
  font-family: Myriad Pro;
  font-weight: normal;
  font-size: 18px;
  line-height: 3.0;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  min-width: 10%;
  width: 240px;
  padding: 60px 10px 10px 50px;
  border-right: 1px solid rgb(180, 180, 180, 1.0);
  background-color: rgb(255, 255, 255, 0.5);
  backdrop-filter: blur(7px);
}
`);
  // menu.style['display']='flex';
  // menu.style['justify-content']='center';
  // menu.style['align-items']='center';
}

document.onkeyup = function (e) {
  e = e || window.event;
  switch (e.keyCode) {
    case 13: // enter 
    case 32: // space bar
    case 34: //page down
    case 39: //arrow right
      switchSlide(1);
      break;
    case 33: // page up
    case 37: // arrow left
      switchSlide(-1);
      break;
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  setPageTitle();
  createCssStyles();
  var body = document.body;
  body.style['display'] = 'none';
  body.style['overflow-x'] = 'hidden';
  if (scrollableSlides.indexOf(getCurrentSlideIndex()) === -1) {
    body.style['overflow-y'] = 'hidden';
  }
});

window.addEventListener('load', function (event) {
  document.body.style['display'] = '';
  resize(false);
  window.scrollTo(0, 0);
  if (!isLocal()) {
    addSideMenu();
  }
});
window.addEventListener('resize', function (event) {
  resize(false);
});