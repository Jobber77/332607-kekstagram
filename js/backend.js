//  backend.js
'use strict';

(function () {
  //  #region constants
  var LINK_TO_PICTURES = 'https://js.dump.academy/kekstagram/data';
  var LINK_TO_POST = 'https://js.dump.academy/kekstagram';
  var TIMEOUT_VALUE = 10000;
  //  endregion
  var getXHRObject = function (onLoadMethod, onErrorMethod) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoadMethod(xhr.response);
      } else {
        onErrorMethod('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onErrorMethod('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onErrorMethod('Запрос не успел выполниться за ' + xhr.timeout + 'мс. Попробуйте еще раз');
    });
    xhr.timeout = TIMEOUT_VALUE;
    return xhr;
  };
  var getData = function (onLoad, onError) {
    var xhr = getXHRObject(onLoad, onError);
    xhr.open('GET', LINK_TO_PICTURES);
    xhr.send();
  };
  var postData = function (data, onLoad, onError) {
    var xhr = getXHRObject(onLoad, onError);
    xhr.open('POST', LINK_TO_POST);
    xhr.send(data);
  };

  window.backend = {
    getData: getData,
    postData: postData
  };
})();
