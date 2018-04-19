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
  var resizeValue = document.querySelector('.resize__control--value');
  var textAreaUpload = document.querySelector('.text__description');
  var inputTagUpload = document.querySelector('.text__hashtags');
  var inputFile = document.querySelector('#upload-file');
  //  #endregion

  var configureEditorForm = function () {
    resizeValue.value = '100%';
    window.slider.hideSlider();
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
    inputTagUpload.addEventListener('blur', window.editorValidation.onInputTagValidation);
    textAreaUpload.addEventListener('blur', onInputFocusLost);
    inputTagUpload.addEventListener('blur', onInputFocusLost);
  };

  var killInputLiseners = function () {
    textAreaUpload.removeEventListener('focus', onInputFocus);
    inputTagUpload.removeEventListener('focus', onInputFocus);
    inputTagUpload.removeEventListener('blur', window.editorValidation.onInputTagValidation);
    textAreaUpload.removeEventListener('blur', onInputFocusLost);
    inputTagUpload.removeEventListener('blur', onInputFocusLost);
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

