//  filters.js
'use strict';

(function () {
  //  #region constants
  var FILTER_MAX_VALUE_GRAYSCALE = 1;
  var FILTER_MAX_VALUE_SEPIA = 1;
  var FILTER_MAX_VALUE_INVERT = 100;
  var FILTER_MAX_VALUE_BLUR = 5;
  var FILTER_MAX_VALUE_BRIGHTNESS = 3;
  //  endregion

  var selectedfilter = 'none';

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
    var level = filterIntensiveness / 100;
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
    if (target.value) {
      window.filters.selectedfilter = target.value;
    }
    if (target.value === 'none') {
      window.slider.hideSlider();
    }
    setFilter(window.imgEditor.imgPreview, window.filters.selectedfilter, 100);
    window.slider.setInitialPinPostition();
  };

  //  expose
  window.filters = {
    onFilterClick: onFilterClick,
    clearFilters: clearFilters,
    selectedfilter: selectedfilter,
    setFilter: setFilter
  };
})();
