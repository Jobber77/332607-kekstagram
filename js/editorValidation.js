//  editorValidation.js
'use strict';

(function () {
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

  // expose
  window.editorValidation = {
    onInputTagValidation
  }
})();
