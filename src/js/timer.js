"use strict";
//таймер обратного отсчета

$(function () {
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
    const clock = document.querySelector('.clock');
    const daysSpan = clock.querySelector('.clock__days');
    const hoursSpan = clock.querySelector('.clock__hours');
    const minutesSpan = clock.querySelector('.clock__minutes');
    const secondsSpan = clock.querySelector('.clock__seconds');

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
  const deadline = $('.promo__clock').attr('data-time'); //3 вариант дата окончания акции c html. attr - селектор на родителе в html документе  data-time="'2023-12-31'"
  initializeClock('promo__clock', deadline);
});
