// imgEditor.js
'use strict';

(function () {
  //  #region constants
  var FILTER_MAX_VALUE_GRAYSCALE = 1;
  var FILTER_MAX_VALUE_SEPIA = 1;
  var FILTER_MAX_VALUE_INVERT = 100;
  var FILTER_MAX_VALUE_BLUR = 5;
  var FILTER_MAX_VALUE_BRIGHTNESS = 3;
  //  endregion

  //  #region query variables
  var imgPreview = document.querySelector('.img-upload__preview > img');
  var selectedfilter = 'none';
  var filterSlider = document.querySelector('.img-upload__scale');
  var resizeValue = document.querySelector('.resize__control--value');
  var textAreaUpload = document.querySelector('.text__description');
  var inputTagUpload = document.querySelector('.text__hashtags');
  var inputFile = document.querySelector('#upload-file');
  var pin = document.querySelector('.scale__pin');
  var scaleLine = document.querySelector('.scale__line');
  var scaleValue = document.querySelector('.scale__value');
  var scaleLevel = document.querySelector('.scale__level');
  //  #endregion

  var configureEditorForm = function () {
    resizeValue.value = '100%';
    hideSlider();
    document.querySelector('#effect-none').checked = true;
  };

  var clearEditForm = function () {
    inputTagUpload.value = '';
    textAreaUpload.value = '';
    inputFile.value = '';
  };

  var setInputLiseners = function () {
    textAreaUpload.addEventListener('focus', onInputFocus);
    inputTagUpload.addEventListener('focus', onInputFocus);
    inputTagUpload.addEventListener('blur', onInputTagValidation);
    textAreaUpload.addEventListener('blur', onInputFocusLost);
    inputTagUpload.addEventListener('blur', onInputFocusLost);
  };

  var killInputLiseners = function () {
    textAreaUpload.removeEventListener('focus', onInputFocus);
    inputTagUpload.removeEventListener('focus', onInputFocus);
    inputTagUpload.removeEventListener('blur', onInputTagValidation);
    textAreaUpload.removeEventListener('blur', onInputFocusLost);
    inputTagUpload.removeEventListener('blur', onInputFocusLost);
  };

  var setFilterLiseners = function () {
    var filters = document.querySelectorAll('.effects__radio');
    for (var i = 0; i < filters.length; i++) {
      filters[i].addEventListener('click', onFilterClick);
    }
    document.querySelector('.resize__control--minus').addEventListener('click', onButtonResizeMinus);
    document.querySelector('.resize__control--plus').addEventListener('click', onButtonResizePlus);
    pin.addEventListener('mousedown', onPinMove);
  };

  var killFilterLiseners = function () {
    var filters = document.querySelectorAll('.effects__radio');
    for (var i = 0; i < filters.length; i++) {
      filters[i].removeEventListener('click', onFilterClick);
    }
    document.querySelector('.resize__control--minus').removeEventListener('click', onButtonResizeMinus);
    document.querySelector('.resize__control--plus').removeEventListener('click', onButtonResizePlus);
    pin.removeEventListener('mousedown', onPinMove);
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

  var showSlider = function () {
    filterSlider.classList.remove('hidden');
  };

  var hideSlider = function () {
    filterSlider.classList.add('hidden');
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

  var setInitialPinPostition = function () {
    //  почему в верстке не меняется атрибуты pin и scaleValue?
    pin.style.left = scaleLine.offsetWidth + 'px';
    scaleLevel.style.width = scaleLine.offsetWidth + 'px';
    scaleValue.value = 1;
  };

  var validateTags = function (string) {
    var errors = [];
    if (!string) {
      return errors;
    }
    var tags = string.split(' ');
    var flagLength = false;
    var flagStartFromSharp = false;
    var flagTooShort = false;
    var flagDuplicate = false;
    tags.forEach(function (tag) {
      //  normalize
      tag = tag.trim();
      if (tag[0] !== '#' && !flagStartFromSharp) {
        errors.push('Теги должны начинаться с #');
        flagStartFromSharp = true;
      } else if (tag.length <= 1 && !flagTooShort) {
        errors.push('Теги должны содержать не менее 2 символов');
        flagTooShort = true;
      } else if (tag.length > 20 && !flagLength) {
        errors.push('Теги должны содержать не более 20 символов');
        flagLength = true;
      } else if (checkForDuplicate(tags, tag) && !flagDuplicate) {
        errors.push('Теги не должны повторяться. Регистр не учитывается.');
        flagDuplicate = true;
      }
    });
    if (tags.length > 5) {
      errors.push('Максимальное количество тегов - 5');
    }
    return errors;
  };

  var checkForDuplicate = function (list, item) {
    var counter = 0;
    list.forEach(function (listItem) {
      if (listItem.toLowerCase() === item.toLowerCase()) {
        counter++;
      }
    });
    return counter > 1 ? true : false;
  };

  var onFilterClick = function (env) {
    var target = env.target.closest('input');
    showSlider();
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
          hideSlider();
          break;
      }
    }
    setFilter(imgPreview, selectedfilter, 1);
    setInitialPinPostition();
  };

  var onButtonResizeMinus = function () {
    var value = parseInt(resizeValue.value, 10);
    if (value > 0) {
      resizeValue.value = (value - 25) + '%';
      imgPreview.style.transform = 'scale(' + (value - 25) / 100 + ')';
    }
  };

  var onButtonResizePlus = function () {
    var value = parseInt(resizeValue.value, 10);
    if (value < 100) {
      resizeValue.value = (value + 25) + '%';
      imgPreview.style.transform = 'scale(' + (value + 25) / 100 + ')';
    }
  };

  var onInputFocus = function () {
    document.removeEventListener('keydown', window.util.onPopupEscPress);
  };

  var onInputFocusLost = function () {
    document.addEventListener('keydown', window.util.onPopupEscPress);
  };

  var onInputTagValidation = function (evt) {
    var input = evt.target.closest('input');
    var errorList = validateTags(input.value);
    if (errorList.length > 0) {
      input.setCustomValidity(errorList.toString());
      input.style.border = '2px solid red';
    } else {
      input.setCustomValidity('');
      input.style.border = '';
    }
  };

  var onPinMove = function (evt) {
    evt.preventDefault();
    var startXCoords = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      calculateNewPosition(moveEvt);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      calculateNewPosition(upEvt);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    var calculateNewPosition = function (moveEvent) {
      var shift = startXCoords - moveEvent.clientX;
      var newPosition = pin.offsetLeft - shift;
      if (newPosition <= 0) {
        newPosition = 0;
      }
      if (newPosition > scaleLine.offsetWidth) {
        newPosition = scaleLine.offsetWidth;
      }
      startXCoords = moveEvent.clientX;
      pin.style.left = newPosition + 'px';
      scaleLevel.style.width = newPosition + 'px';
      scaleValue.value = newPosition / scaleLine.offsetWidth;
      setFilter(imgPreview, selectedfilter, scaleValue.value);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  //  expose
  var showEditorForm = function () {
    document.querySelector('.img-upload__overlay').classList.remove('hidden');
    configureEditorForm();
    setFilterLiseners();
    setInputLiseners();
    document.querySelector('#upload-cancel').addEventListener('click', this.hideEditorForm);
  };

  var hideEditorForm = function () {
    document.querySelector('.img-upload__overlay').classList.add('hidden');
    document.querySelector('#upload-file').value = '';
    document.removeEventListener('keydown', window.util.onPopupEscPress);
    document.querySelector('#upload-cancel').removeEventListener('click', this.hideEditorForm);
    clearFilters(imgPreview);
    clearEditForm();
    killInputLiseners();
    killFilterLiseners();
  }

  window.imgEditor = {
    showEditorForm,
    hideEditorForm
  };

})();

