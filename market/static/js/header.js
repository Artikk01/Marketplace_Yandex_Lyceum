const toggleBtn = document.querySelector('.header__toggle');
const menu = document.querySelector('.header__right');

toggleBtn.addEventListener('click', () => {
  menu.classList.toggle('header__right--open');
});
