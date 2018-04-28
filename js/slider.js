//  slider.js
'use strict';

(function () {
  var filterSlider = document.querySelector('.img-upload__scale');
  var pin = document.querySelector('.scale__pin');
  var scaleLine = document.querySelector('.scale__line');
  var scaleValue = document.querySelector('.scale__value');
  var scaleLevel = document.querySelector('.scale__level');

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
      if (newPosition <= 0) {
        newPosition = 0;
      }
      if (newPosition > scaleLine.offsetWidth) {
        newPosition = scaleLine.offsetWidth;
      }
      startXCoords = moveEvent.clientX;
      pin.style.left = newPosition + 'px';
      scaleLevel.style.width = newPosition + 'px';
      scaleValue.value = Math.round(newPosition / scaleLine.offsetWidth * 100);
      window.filters.setFilter(window.imgEditor.imgPreview, window.filters.selectedfilter, scaleValue.value);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  //  expose
  window.slider = {
    onPinMove: onPinMove,
    setInitialPinPostition: setInitialPinPostition,
    showSlider: showSlider,
    hideSlider: hideSlider,
    pin: pin
  };
})();
