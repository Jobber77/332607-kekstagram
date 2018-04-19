//  filters.js
'use strict';

(function () {
  var selectedfilter = 'none';

  var setFilterLiseners = function () {
    var filters = document.querySelectorAll('.effects__radio');
    for (var i = 0; i < filters.length; i++) {
      filters[i].addEventListener('click', onFilterClick);
    }
    document.querySelector('.resize__control--minus').addEventListener('click', onButtonResizeMinus);
    document.querySelector('.resize__control--plus').addEventListener('click', onButtonResizePlus);
    window.slider.pin.addEventListener('mousedown',  window.slider.onPinMove);
  };

  var killFilterLiseners = function () {
    var filters = document.querySelectorAll('.effects__radio');
    for (var i = 0; i < filters.length; i++) {
      filters[i].removeEventListener('click', onFilterClick);
    }
    document.querySelector('.resize__control--minus').removeEventListener('click', onButtonResizeMinus);
    document.querySelector('.resize__control--plus').removeEventListener('click', onButtonResizePlus);
    window.slider.pin.removeEventListener('mousedown',  window.slider.onPinMove);
  };

  var clearFilters = function (img) {
    img.classList.remove('effects__preview--none');
    img.classList.remove('effects__preview--chrome');
    img.classList.remove('effects__preview--sepia');
    img.classList.remove('effects__preview--marvin');
    img.classList.remove('effects__preview--phobos');
    img.classList.remove('effects__preview--heat');
    img.style.filter = '';
  };

  var setFilter = function (img, filterName, filterIntensiveness) {
    var filterClass = 'effects__preview--none';
    var filterCSS = '';
    var level = filterIntensiveness;
    switch (filterName) {
      case 'chrome':
        filterClass = 'effects__preview--chrome';
        filterCSS = 'grayscale';
        level *= FILTER_MAX_VALUE_GRAYSCALE;
        break;
      case 'sepia':
        filterClass = 'effects__preview--sepia';
        filterCSS = 'sepia';
        level *= FILTER_MAX_VALUE_SEPIA;
        break;
      case 'marvin':
        filterClass = 'effects__preview--marvin';
        filterCSS = 'invert';
        level = level * FILTER_MAX_VALUE_INVERT + '%';
        break;
      case 'phobos':
        filterClass = 'effects__preview--phobos';
        filterCSS = 'blur';
        level = level * FILTER_MAX_VALUE_BLUR + 'px';
        break;
      case 'heat':
        filterClass = 'effects__preview--heat';
        filterCSS = 'brightness';
        level *= FILTER_MAX_VALUE_BRIGHTNESS;
        break;
    }
    clearFilters(img);
    img.classList.add(filterClass);
    if (filterCSS) {
      img.style.filter = filterCSS + '(' + level + ')';
    }
  };

  var onFilterClick = function (env) {
    var target = env.target.closest('input');
    window.slider.showSlider();
    // check if object is found
    if (target) {
      switch (target.value) {
        case 'chrome':
          selectedfilter = 'chrome';
          break;
        case 'sepia':
          selectedfilter = 'sepia';
          break;
        case 'marvin':
          selectedfilter = 'marvin';
          break;
        case 'phobos':
          selectedfilter = 'phobos';
          break;
        case 'heat':
          selectedfilter = 'heat';
          break;
        case 'none':
          selectedfilter = 'none';
          window.slider.hideSlider();
          break;
      }
    }
    setFilter(imgPreview, selectedfilter, 1);
    window.slider.setInitialPinPostition();
  };

  //  expose
  window.filters = {

  };
})();
