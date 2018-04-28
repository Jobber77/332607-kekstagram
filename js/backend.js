//  backend.js
'use strict';

(function () {
  var TIMEOUT_VALUE = 10000;
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
  var getData = function (link, onLoad, onError) {
    var xhr = getXHRObject(onLoad, onError);
    xhr.open('GET', link);
    xhr.send();
  };
  var postData = function (data, link, onLoad, onError) {
    var xhr = getXHRObject(onLoad, onError);
    xhr.open('POST', link);
    xhr.send(data);
  };

  window.backend = {
    getData: getData,
    postData: postData
  };
})();
