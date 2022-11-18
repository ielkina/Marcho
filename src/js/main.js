"use strict";
$(function () {
  $('.slider').slick({
    dots: true,
    arrows: false,
    fade: true,
    // infinite: true,
    // slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000
    // speed: 30000
    // speed: 3000
  });
  $(".product-item__star").rateYo({
    starWidth: "17px",
    normalFill: "#ccccce",
    ratedFill: "#ffc35b",
    // ratedStroke: "#ffc35b",
    // rating: 4,
    // spacing: "5px",
    // multiColor: {
    //   "startColor": "#FF0000", //RED
    //   "endColor": "#00FF00"  //GREEN
    // },
    // numStars: 10,
    // maxValue: 1,
    // numStars: 1,
    // starWidth: "40px",
    // precision: 2,
    // rating: "50%",
    // precision: 0,
    // rating: 1.5,
    // halfStar: true,
    // fullStar: true,
    // rating: 3.2,
    readOnly: true,
    //   "starSvg": '<svg class="icon">'+
    //    ' <use xlink:href="img/icons/sprite.svg#icon-heart"></use>'+
    //  ' </svg>'
  });
  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }

  function initializeClock(id, endtime) {
    const clock = document.querySelector('.promo__clock');
    const daysSpan = clock.querySelector('.promo__clock-days');
    const hoursSpan = clock.querySelector('.promo__clock-hours');
    const minutesSpan = clock.querySelector('.promo__clock-minutes');
    const secondsSpan = clock.querySelector('.promo__clock-seconds');

    function updateClock() {
      const t = getTimeRemaining(endtime);

      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
  }

  // const deadline = new Date(Date.parse(new Date()) + 29 * 24 * 60 * 60 * 1000);//1 вариант
  // const deadline = '2022-12-31'; //2 вариант дата окончания акции
  const deadline = $('.promo__clock'). attr('data-time'); //3 вариант дата окончания акции c html
  initializeClock('promo__clock', deadline);
});

