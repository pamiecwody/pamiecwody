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

function getUrlParameter(location, name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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

function openSlide(index) {
  if (slideExist(index)) {
    var path = getSlideFileNameForIndex(index);
    if (isMenuOpen()) {
      path += '?openSideMenu=true';
    }
    window.open(path, '_self');
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
    if (isMenuOpen()) {
      closeSideMenu();
    } else {
      openSideMenu();
    }
  });
}

function openSideMenu() {
  var menu = document.querySelector('.sideMenu');
  menu.style['visibility'] = '';
  menu.style['opacity'] = '1';
}

function closeSideMenu() {
  var menu = document.querySelector('.sideMenu');
  menu.style['opacity'] = '0';
  menu.style['visibility'] = 'hidden';
}

function createMenu() {
  var menu = createElement(document.body.parentElement, 'div');
  menu.className = 'sideMenu';
  menu.style['visibility'] = 'hidden';
  menu.style['opacity'] = '0';
  createHamburgerButton(menu);
  return menu;
}

function isMenuOpen() {
  var sideMenu = document.querySelector('.sideMenu');
  return sideMenu !== null && sideMenu !== undefined && !(sideMenu.style['visibility'] === 'hidden');
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

function addMenuFooter(menuElement, name, year) {
  var footer = createElement(menuElement, 'div');
  footer.className = 'menuFooter';

  var footerContent = createElement(footer, 'div');
  footerContent.className = 'menuFooterContent';

  var menuItemIcon = createElement(footerContent, 'div');
  menuItemIcon.className = 'icon ala';

  var text = createElement(footerContent, 'p');
  text.innerText = name;
}

function addMenuItem(menuElement, text, iconClassName, slideIndex) {
  var menuItem = createElement(menuElement, 'p');
  menuItem.className = 'menuItem';

  var menuItemIcon = createElement(menuItem, 'div');
  menuItemIcon.className = 'icon ' + iconClassName;

  var link = createElement(menuItem, 'a');
  link.href = getSlideFileNameForIndex(slideIndex);
  link.onclick = function (e) {
    e.preventDefault();
    openSlide(slideIndex);
  };
  link.innerText = text;

  return menuItem;
}

function addSideMenu() {
  var menu = createMenu();
  addMenuHeader(menu, 'pamięć wody');
  addMenuItem(menu, 'sieci dróg wodnych w Europie', 'sieci', 3);
  addMenuItem(menu, 'Kanał Mazurski', 'kanal', 10);
  addMenuItem(menu, 'historia i tożsamość', 'historia', 25);
  addMenuItem(menu, 'analiza dostępności', 'analizadost', 32);
  addMenuItem(menu, 'analiza percepcyjna', 'analizaperc', 37);
  addMenuItem(menu, 'architektura pogranicza', 'archipogr', 43);
  addMenuItem(menu, 'śluzy', 'sluzy', 47);
  addMenuItem(menu, 'wnioski', 'wnioski', 50);
  addMenuItem(menu, 'szlak turystyki angażującej', 'szlak', 59);
  addMenuItem(menu, 'kontakt', 'kontakt', 86);
  addMenuFooter(menu, "© Alicja Maculewicz 2020");
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
  position: fixed;
  top: calc(100vh - 56px);
  left: 0px;
  width: calc(100% - 10px);
  height: 56px;
  padding: 0px 10px 10px 0px; 
  background-color: rgb(200, 200, 200, 0.1);
  border-top: 1px solid rgb(180, 180, 180, 1.0);
  font-family: Myriad Pro;
  font-size: 12px;
  text-transform: uppercase;
}

.menuFooterContent {
  display: flex;
  align-items: center;
}

.menuFooter .menuFooterContent p {
  line-height: 56px;
}

.menuHeader {
  position: fixed;
  font-family: Frank Ruhl Libre Black;
  font-size: 22px;
  top: 0px;
  left: 0px;
  width: calc(100% - 55px);
  height: 45px;
  line-height: 32px;
  padding: 10px 10px 0px 46px; 
  background-color: rgb(160, 160, 160, 0.1);
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
  width: 280px;
  padding: 60px 10px 10px 0px;
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
  // invaliadate cache
  window.applicationCache.addEventListener('updateready', function (e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    }
  }, false);

  document.body.style['display'] = '';
  resize(false);
  window.scrollTo(0, 0);
  if (!isLocal()) {
    addSideMenu();
    if (getUrlParameter(window.location.search, 'openSideMenu') === 'true') {
      openSideMenu();
    }
  }
});
window.addEventListener('resize', function (event) {
  resize(false);
});