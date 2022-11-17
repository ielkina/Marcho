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
});