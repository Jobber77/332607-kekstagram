//  backend.js
'use strict';

(function () {
  var getData = function (link, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + 'с. Попробуйте еще раз');
    });
    xhr.timeout = 10000; // 10 sec
    xhr.open('GET', link);
    xhr.send();
  };
  var postData = function (data, link, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + 'с. Попробуйте еще раз');
    });
    xhr.timeout = 10000; // 10 sec
    xhr.open('POST', link);
    xhr.setRequestHeader('content-type', 'multipart/form-data');
    xhr.send();
  };

  window.backend = {
    getData: getData,
    postData: postData
  };
})();
