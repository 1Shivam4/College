/* eslint-disable */
function mmenu(menu, list, img) {
  // const mmenu = document.querySelector('.m-menu');
  const mmenu = document.querySelector(menu);
  let showMenu = false;
  mmenu.addEventListener('click', () => {
    // const menuImg = document.querySelector('#menu-img');
    const menuImg = document.querySelector(img);
    // const mlist = document.querySelector('.m-nav-list');
    const mlist = document.querySelector(list);
    if (!showMenu) {
      showMenu = true;
      mlist.classList.remove('hidden');
      menuImg.setAttribute('src', '/img/close.svg');
    } else {
      showMenu = false;
      mlist.classList.add('hidden');
      menuImg.setAttribute('src', '/img/menu.svg');
    }
  });
}

mmenu('.m-menu', '.m-nav-list', '#menu-img');
