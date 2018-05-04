//  slider.js
'use strict';

(function () {
  var filterSlider = document.querySelector('.img-upload__scale');
  var pin = document.querySelector('.scale__pin');
  var scaleLine = document.querySelector('.scale__line');
  var scaleValue = document.querySelector('.scale__value');
  var scaleLevel = document.querySelector('.scale__level');

  var SHIFT_PER_TICK = 5;
  var LEFT_ARROW_KEYCODE = 37;
  var RIGHT_ARROW_KEYKODE = 39;

  var showSlider = function () {
    filterSlider.classList.remove('hidden');
  };

  var hideSlider = function () {
    filterSlider.classList.add('hidden');
  };

  var setInitialPinPostition = function () {
    pin.style.left = scaleLine.offsetWidth + 'px';
    scaleLevel.style.width = scaleLine.offsetWidth + 'px';
    scaleValue.value = 1;
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
      newPosition = validateNewPosition(newPosition);
      startXCoords = moveEvent.clientX;
      updateDOM(newPosition);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  var onArrowKeyPress = function () {
    var onKeyDown = function (moveEvt) {
      if (moveEvt.keyCode === LEFT_ARROW_KEYCODE || moveEvt.keyCode === RIGHT_ARROW_KEYKODE) {
        calculateNewPosition(moveEvt);
        document.removeEventListener('keydown', onKeyDown);
      }
    };
    var calculateNewPosition = function (moveEvent) {
      //  1 === left, 2 === right
      var shiftDirection = moveEvent.keyCode === 	LEFT_ARROW_KEYCODE ? 1 : -1;
      var newPosition = pin.offsetLeft - SHIFT_PER_TICK * shiftDirection;
      newPosition = validateNewPosition(newPosition);
      updateDOM(newPosition);
    };
    document.addEventListener('keydown', onKeyDown);
  };
  var validateNewPosition = function (newPosition) {
    if (newPosition <= 0) {
      newPosition = 0;
    }
    if (newPosition > scaleLine.offsetWidth) {
      newPosition = scaleLine.offsetWidth;
    }
    return newPosition;
  };
  var updateDOM = function (newPosition) {
    pin.style.left = newPosition + 'px';
    scaleLevel.style.width = newPosition + 'px';
    scaleValue.value = Math.round(newPosition / scaleLine.offsetWidth * 100);
    window.filters.setFilter(window.imgEditor.imgPreview, window.filters.selectedfilter, scaleValue.value);
  };
  //  expose
  window.slider = {
    onPinMove: onPinMove,
    onArrowKeyPress: onArrowKeyPress,
    setInitialPinPostition: setInitialPinPostition,
    showSlider: showSlider,
    hideSlider: hideSlider,
    pin: pin
  };
})();
