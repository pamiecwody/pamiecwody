var scrollableSlides = [12, 45, 61, 63];
var firstSlideIndex = 1;
var lastSlideIndex = 86;

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

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[#&]' + name + '=([^&#]*)');
  var results = regex.exec(window.location.hash);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
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
  var path = window.location.pathname.replace(/(\d+)\.xhtml$/, slideIndex + '.xhtml');
  return path;
}


function switchSlide(offset) {
  openSlide(getCurrentSlideIndex() + offset);
}

function openSlide(index, button) {
  if (slideExist(index)) {
    var path = getSlideFileNameForIndex(index);
    var queryParams = [];
    if (isMenuOpen()) {
      queryParams.push('openSideMenu=true');
    }
    if (isButtonContainerVisible()) {
      queryParams.push('showButtons=true');
    } else {
      queryParams.push('showButtons=false');
    }
    if (queryParams.length > 0) {
      path += '#';
      path += queryParams.join("&");
    }
    window.open(path, '_self');
  }
}

function isButtonContainerVisible() {
  var buttonContainer = document.querySelector('.buttonContainer');
  return buttonContainer !== null && buttonContainer !== undefined && buttonContainer.style['opacity'] === '1';
}

function slideExist(slideIndex) {
  return slideIndex >= firstSlideIndex && slideIndex <= lastSlideIndex;
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

function createHamburgerButton(additionalContentElement, menu) {
  var button = createElement(additionalContentElement, 'button');
  button.className = 'hamburgerButton';
  button.innerText = '☰';

  menu.style['display'] = 'none'
  menu.style['opacity'] = '0'
  menu.style['transition'] = 'opacity 0.1s linear';
  button.addEventListener("click", function () {
    if (isMenuOpen()) {
      closeSideMenu();
    } else {
      openSideMenu();
    }
  });
}

function openSideMenu() {
  var menu = document.querySelector('.sideMenu');
  menu.style['display'] = '';
  menu.style['opacity'] = '1';
}

function closeSideMenu() {
  var menu = document.querySelector('.sideMenu');
  menu.style['opacity'] = '0';
  setTimeout(function () {
    menu.style['display'] = 'none';
  }, 100);
}

function isMenuOpen() {
  var sideMenu = document.querySelector('.sideMenu');
  return sideMenu !== null && sideMenu !== undefined && !(sideMenu.style['display'] === 'none');
}

function addMenuHeader(menuElement, text) {
  var header = createElement(menuElement, 'p');
  header.className = 'menuHeader';

  var link = createElement(header, 'a');
  link.href = getSlideFileNameForIndex(1);
  link.onclick = function (e) {
    e.preventDefault();
    openSlide(1);
  };
  link.innerText = text;
}

function addMenuFooter(menuElement, text) {
  var footer = createElement(menuElement, 'div');
  footer.className = 'menuFooter';

  var footerContent = createElement(footer, 'div');
  footerContent.className = 'menuFooterContent';

  var menuItemIcon = createElement(footerContent, 'div');
  menuItemIcon.className = 'icon ala';

  var textElement = createElement(footerContent, 'p');
  textElement.innerText = text;
}

function addMenuItem(menuElement, text, iconClassName, slideIndex, nextMenuItemSlideIndex) {
  var menuItem = createElement(menuElement.querySelector('.menuContent'), 'a');
  menuItem.className = 'menuItem';
  menuItem.href = getSlideFileNameForIndex(slideIndex);
  menuItem.onclick = function (e) {
    e.preventDefault();
    openSlide(slideIndex);
  };

  var menuItemIcon = createElement(menuItem, 'div');
  menuItemIcon.className = 'icon ' + iconClassName;
  var textElement = createElement(menuItem, 'div');
  textElement.innerText = text;

  var currentSlideIndex = getCurrentSlideIndex();
  if (currentSlideIndex >= slideIndex && currentSlideIndex < nextMenuItemSlideIndex) {
    textElement.style['font-weight'] = 'bold';
    document.title += ' - ' + text;
  }

  return menuItem;
}

function createMenu(additionalContentElement) {
  var menu = createElement(additionalContentElement, 'div');
  menu.className = 'sideMenu';
  addMenuHeader(menu, 'pamięć wody');
  var menuContent = createElement(menu, 'div');
  menuContent.className = 'menuContent';
  createHamburgerButton(additionalContentElement, menu);
  addMenuItem(menu, 'sieci dróg wodnych w Europie', 'sieci', 3, 10);
  addMenuItem(menu, 'Kanał Mazurski', 'kanal', 10, 25);
  addMenuItem(menu, 'historia i tożsamość', 'historia', 25, 32);
  addMenuItem(menu, 'analiza dostępności', 'analizadost', 32, 37);
  addMenuItem(menu, 'analiza percepcyjna', 'analizaperc', 37, 43);
  addMenuItem(menu, 'architektura pogranicza', 'archipogr', 43, 47);
  addMenuItem(menu, 'śluzy', 'sluzy', 47, 50);
  addMenuItem(menu, 'wnioski', 'wnioski', 50, 59);
  addMenuItem(menu, 'szlak turystyki angażującej', 'szlak', 59, 86);
  addMenuItem(menu, 'kontakt', 'kontakt', 86, 87);
  addMenuFooter(menu, "© Alicja Maculewicz 2020");
  return menu;
}

function createArrowButton(buttonContainer, text, className, slideOffset) {
  var button = createElement(buttonContainer, 'div');
  button.className = 'arrowButton ' + className;
  button.innerText = text;
  button.onclick = function () {
    switchSlide(slideOffset);
  }

  var currentSlideIndex = getCurrentSlideIndex();
  if (slideOffset === -1 && currentSlideIndex === firstSlideIndex) {
    button.style['visibility'] = 'hidden';
  }
  if (slideOffset === 1 && currentSlideIndex === lastSlideIndex) {
    button.style['visibility'] = 'hidden';
  }
}

function createArrowButtons(additionalContent) {
  var buttonContainer = createElement(additionalContent, 'div');
  buttonContainer.className = 'buttonContainer';
  
  createArrowButton(buttonContainer, '❮', 'left', -1);
  createArrowButton(buttonContainer, '❯', 'right', 1);

  var timer = null;
  document.addEventListener("mousemove", function () {
    buttonContainer.style['opacity'] = '1';
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      if (buttonContainer.style['opacity'] === '1') {
        buttonContainer.style['opacity'] = '0';
      }
    }, 5000);
  });

  var showButtons = getUrlParameter('showButtons');
  if (showButtons === 'false') {
    buttonContainer.style['opacity'] = '0';
  } else if (showButtons === 'true') {
    timer = setTimeout(function () {
      buttonContainer.style['opacity'] = '0';
    }, 5000);
  } else {
    timer = setTimeout(function () {
      buttonContainer.style['opacity'] = '0';
    }, 1000);
  }
}

function createAdditionalContent() {
  var additionalContent = createElement(document.body.parentElement, 'div');
  additionalContent.className = 'additionalContent';
  createMenu(additionalContent);
  createArrowButtons(additionalContent);
}


function setPageTitle() {
  document.title = 'Pamięć wody';
}

function addPngFaviconLink(size) {
  var link = document.createElement('link');
  link.type = 'image/png';
  link.rel = 'icon';
  link.href = 'favicon-' + size + 'x' + size + '.png';
  link.sizes = '' + size + 'x' + size;
  document.getElementsByTagName('head')[0].appendChild(link);
}

function addIcoFaviconLink() {
  var link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = 'favicon.ico';
  document.getElementsByTagName('head')[0].appendChild(link);
}

function createCssStyles() {
  addCssStyle(`
.additionalContent {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

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
  pointer-events: all;
}

.menuItem {
  display: flex;
  align-items: center;
}

.icon {
  width: 36px;
  height: 36px;
  background-repeat: no-repeat !important;
  background-size: 100% !important;
  margin: 0px 5px;
}

.menuItem .icon.sieci {
  background: url('image/custom/ikonki.png') 0px 0px;
}

.menuItem .icon.kanal {
  background: url('image/custom/ikonki.png') 0px -36px;
}

.menuItem .icon.historia {
  background: url('image/custom/ikonki.png') 0px -72px;
}

.menuItem .icon.analizadost {
  background: url('image/custom/ikonki.png') 0px -108px;
}

.menuItem .icon.analizaperc {
  background: url('image/custom/ikonki.png') 0px -144px;
}

.menuItem .icon.archipogr {
  background: url('image/custom/ikonki.png') 0px -180px;
}

.menuItem .icon.sluzy {
  background: url('image/custom/ikonki.png') 0px -216px;
}

.menuItem .icon.wnioski {
  background: url('image/custom/ikonki.png') 0px -252px;
}

.menuItem .icon.szlak {
  background: url('image/custom/ikonki.png') 0px -288px;
}

.menuItem .icon.kontakt {
  background: url('image/custom/ikonki.png') 0px -324px;
}

.menuFooter .icon.ala {
  background: url('image/custom/ikonki.png') 0px -360px;
}

.menuFooter {
  padding: 0px 10px 10px 0px; 
  background-color: rgb(250, 250, 250, 0.5);
  border: 1px solid rgb(180, 180, 180, 1.0);
  font-family: Myriad Pro;
  font-size: 12px;
  text-transform: uppercase;
  z-index: 0;
}

.menuFooterContent {
  display: flex;
  align-items: center;
}

.menuFooter .menuFooterContent p {
  line-height: 56px;
}

.menuHeader {
  font-family: Frank Ruhl Libre Black;
  font-size: 22px;
  height: 45px;
  line-height: 32px;
  padding: 10px 10px 0px 46px; 
  background-color: rgb(200, 200, 200, 0.1);
  border: 1px solid rgb(180, 180, 180, 1.0);
  z-index: 1;
}

.sideMenu {
  font-family: Myriad Pro;
  font-weight: normal;
  font-size: 18px;
  line-height: 3.0;
  height: 100%;
  min-width: 300px;
  background-color: rgb(255, 255, 255, 0.5);
  backdrop-filter: blur(7px);
  pointer-events: all;
}

.menuContent {
  overflow-y: auto;
  height: calc(100% - 120px);
  padding: 0px 10px 10px 0px;
  border-left: 1px solid rgb(180, 180, 180, 1.0);
  border-right: 1px solid rgb(180, 180, 180, 1.0);
}

.buttonContainer {
  opacity: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: all;
  transition: opacity ease-in 0.2s;
}

.arrowButton {
  color: white;
  width: 50px;
  height: 50px;
  background-color: rgba(84, 84, 84, 0.28);
  backdrop-filter: blur(2px);
  border-radius: 60px;
  text-align: center;
  line-height: 50px;
  font-size: 33px;
  user-select: none;
  margin: 40px 15px 40px 15px;
  cursor: pointer;
}

.arrowButton:hover{
  width: 70px;
  height: 70px;
  margin: 30px 5px 10px 5px;
  line-height: 70px;
  font-size: 44px;
  transition: all 0.2s;
}

@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 800px) {

    .hamburgerButton {
      left: 15px;
      font-size: 120px;
    }

    .menuHeader {
      font-size: 60px;
      height: 170px;
      line-height: 170px;
      padding-left: 160px; 
    }

    .sideMenu {
      min-width: 55%;
      background-color: rgb(255, 255, 255, 0.8);
    }
    
    .menuItem .icon {
      transform: scale(3.5);
      margin: 0px 50px 0px 50px;
    }

    .menuContent {
      font-size: 45px;
    }

    .arrowButton {
      width: 150px;
      height: 150px;
      border-radius: 150px;
      line-height: 150px;
      font-size: 80px;
      margin: 40px 0px 40px 0px;
    }
    
    .arrowButton:hover {
      width: 200px;
      height: 200px;
      line-height: 200px;
      font-size: 100px;
    }
}

@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 800px) {

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
  addIcoFaviconLink();
  addPngFaviconLink(16);
  addPngFaviconLink(32);
  addPngFaviconLink(96);
  addPngFaviconLink(192);
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
    createAdditionalContent();
    if (getUrlParameter('openSideMenu') === 'true') {
      openSideMenu();
    }
  }
});
window.addEventListener('resize', function (event) {
  resize(false);
});