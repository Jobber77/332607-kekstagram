//  util.js
'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  var getRandomList = function (list, amount, isComments) {
    var commentList = [];
    for (var i = 0; i < amount; i++) {
      //  random choose amount of composite comments
      var compositeNumber = isComments ? getRandomNumber(1, 2) : 1;
      compositeNumber = compositeNumber < list.length ? compositeNumber : list.length;
      var comment = '';
      for (var j = 0; j < compositeNumber; j++) {
        comment += list[getRandomNumber(0, list.length - 1)];
      }
      commentList.push(comment);
    }
    return commentList;
  };
  var createDOMElement = function (type, classes, textContent) {
    var element = document.createElement(type);
    //  check if classes variable is Array
    if (typeof classes === 'object') {
      for (var i = 0; i < classes.length; i++) {
        element.classList.add(classes[i]);
      }
    } else {
      element.classList.add(classes);
    }
    if (textContent) {
      element.textContent = textContent;
    }
    return element;
  };
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.preview.hideImgPreview();
      window.imgEditor.hideEditorForm();
    }
  };
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomList: getRandomList,
    createDOMElement: createDOMElement,
    onPopupEscPress: onPopupEscPress,
    debounce: debounce
  };
})();
