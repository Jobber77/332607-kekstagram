// galery.js
'use strict';

(function () {
  //  source IMG array
  var imgList = [];
  var filterButtons = document.querySelectorAll('.img-filters__button');
  var activeFilter = 'filter-popular';

  var drawPictures = function (pictures) {
    //  fill source img array if this is first function call
    if (imgList.length === 0) {
      imgList = addIndex(pictures).slice();
    }
    pictures = activeFilterToMethod[activeFilter](pictures);
    clearPictures();
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#picture').content;
    pictures.forEach(function (picture) {
      var aElementToClone = template.querySelector('.picture__link').cloneNode(true);
      aElementToClone.pictureId = picture.id;
      var image = aElementToClone.querySelector('.picture__img');
      image.src = picture.url;
      var commentSpan = aElementToClone.querySelector('.picture__stat--comments');
      commentSpan.textContent = picture.comments.length;
      var likeSpan = aElementToClone.querySelector('.picture__stat--likes');
      likeSpan.textContent = picture.likes;
      fragment.appendChild(aElementToClone);
    });
    document.querySelector('.pictures').appendChild(fragment);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  var clearPictures = function () {
    var pictures = document.querySelectorAll('.picture__link');
    pictures.forEach(function (picture) {
      picture.remove();
    });
  };

  var addIndex = function (list) {
    var counter = 0;
    list.forEach(function (item) {
      item.id = counter++;
    });
    return list;
  };
  var filterPopular = function (list) {
    list.sort(function (prev, next) {
      return next.likes - prev.likes;
    });
    return list;
  };
  var filterNew = function () {
    return imgList.slice();
  };
  var filterDiscussed = function (list) {
    list.sort(function (prev, next) {
      return next.comments.length - prev.comments.length;
    });
    return list;
  };

  var findClickedPictureObject = function (clickedDOMelement) {
    var id = clickedDOMelement.pictureId;
    var clickedImage = {};
    for (var i = 0; i < imgList.length; i++) {
      if (imgList[i].id === id) {
        clickedImage = imgList[id];
      }
    }
    return clickedImage;
  };

  var clearFiltersActiveStatus = function () {
    filterButtons.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
  };

  var onGaleryFilterClick = function (evt) {
    if (!evt.target.classList.contains('img-filters__button--active')) {
      clearFiltersActiveStatus();
      evt.target.classList.add('img-filters__button--active');
      activeFilter = evt.target.id;
      window.util.debounce(drawPictures(imgList.slice()));
    }
  };

  var onFileInputClick = function () {
    window.imgEditor.showEditorForm();
    document.addEventListener('keydown', window.util.onPopupEscPress);
  };

  var onPictureClick = function (evt) {
    var target = evt.target.closest('.picture__link');
    if (target) {
      evt.preventDefault();
      window.preview.showImgPreview(findClickedPictureObject(target));
      document.addEventListener('keydown', window.util.onPopupEscPress);
    }
  };

  var onLoadError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: yellow; min-height: 50px; padding: 10px;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.color = 'black';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var setGaleryLiseners = function () {
    document.querySelector('.pictures').addEventListener('click', onPictureClick);
    document.querySelector('#upload-file').addEventListener('change', onFileInputClick);
    filterButtons.forEach(function (button) {
      button.addEventListener('click', onGaleryFilterClick);
    });
  };
  window.backend.getData(drawPictures, onLoadError);
  setGaleryLiseners();

  var activeFilterToMethod = {
    'filter-popular': filterPopular,
    'filter-new': filterNew,
    'filter-discussed': filterDiscussed
  };

})();
