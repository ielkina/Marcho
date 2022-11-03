document.addEventListener("DOMContentLoaded", () => {
  //Mobile Menu
  const burger = document.querySelector(".burger"); //наша кнопка
  // const mobileMenu = document.querySelector(".menu__list"); //мобильное меню
  const mobileMenu = document.querySelector(".navbar"); //мобильное меню
  const mobileLogo = document.querySelector(".logo")//лого
  const bodyLock = document.querySelector("body"); //ищем как селектор ТЕГА

  burger.addEventListener("click", () => {
    // mobileMenu.classList.toggle("menu__list--active"); //когда меню открыто
    mobileMenu.classList.toggle("navbar--active"); //когда меню открыто
    // if (mobileMenu.classList.contains("menu__list--active")) {
    if (mobileMenu.classList.contains("navbar--active")) {
      //Проверяем, есть ли у меню активный класс
      burger.classList.add("burger--active"); //Когда открыто, иконка становится крестиком
      bodyLock.classList.add("lock"); //Блокируем скролл при открытом меню
    } else {
      //Когда нету активного класса у меню
      burger.classList.remove("burger--active"); //Возвращает в исходное состояние
      bodyLock.classList.remove("lock"); //Разрешаем скроллить
    }
  });
  document.addEventListener("click", function (e) {
    if (e.target !== burger && e.target !== mobileMenu) {
      burger.classList.remove("burger--active");
      // mobileMenu.classList.remove("menu__list--active");
      mobileMenu.classList.remove("navbar--active");
      bodyLock.classList.remove("lock");
    }
  });
});
$(function () {
  $('.reviews-slider').slick({
    dots: true,
    arrows: true,
    prevArrow: '<button type="button" class="slick-prev"><svg class="slick-prev__icon"><use class="slick-prev__icon-use" xlink:href="img/sprite.svg#icon-prev-arrow"></use></svg></button >',
    nextArrow: '<button type="button" class="slick-next"><svg class="slick-next__icon"><use class="slick-next__icon-use" xlink:href="img/sprite.svg#icon-next-arrow"></use></svg></button>'
  });
  var mixer = mixitup('.popular-food');
})


