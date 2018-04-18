//  util.js
'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  var getRandomList = function (list, amount, isComments) {
    var commentList = [];
    for (var i = 0; i < amount; i++) {
      //  random choose amount of composite comments
      var compositeNumber = isComments ? this.getRandomNumber(1, 2) : 1;
      compositeNumber = compositeNumber < list.length ? compositeNumber : list.length;
      var comment = '';
      for (var j = 0; j < compositeNumber; j++) {
        comment += list[this.getRandomNumber(0, list.length - 1)];
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

  window.util = {
    getRandomNumber,
    getRandomList,
    createDOMElement,
    onPopupEscPress
  };
})();
