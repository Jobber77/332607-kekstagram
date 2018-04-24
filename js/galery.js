// galery.js
'use strict';

(function () {
  //  #region constants
  var LINK_TO_PICTURES = 'https://js.dump.academy/kekstagram/data';
  //  endregion
  var ImgList = [];

  var drawPictures = function (pictures) {
    var counter = 0;
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#picture').content;
    pictures.forEach(function (picture) {
      var aElementToClone = template.querySelector('.picture__link').cloneNode(true);
      aElementToClone.pictureId = pictures.indexOf(picture);
      var image = aElementToClone.querySelector('.picture__img');
      image.src = picture.url;
      var commentSpan = aElementToClone.querySelector('.picture__stat--comments');
      commentSpan.textContent = picture.comments.length;
      var likeSpan = aElementToClone.querySelector('.picture__stat--likes');
      likeSpan.textContent = picture.likes;
      picture.id = counter++;
      fragment.appendChild(aElementToClone);
    });
    ImgList = pictures;
    document.querySelector('.pictures').appendChild(fragment);
  };

  var findClickedPictureObject = function (clickedDOMelement) {
    var id = clickedDOMelement.pictureId;
    var clickedImage = {};
    for (var i = 0; i < ImgList.length; i++) {
      if (ImgList[i].id === id) {
        clickedImage = ImgList[id];
      }
    }
    return clickedImage;
  };

  var onPictureClick = function (evt) {
    var target = evt.target.closest('a');
    if (target) {
      evt.preventDefault();
      window.preview.showImgPreview(findClickedPictureObject(target));
      document.addEventListener('keydown', window.util.onPopupEscPress);
    }
  };

  var onFileInputClick = function () {
    window.imgEditor.showEditorForm();
    document.addEventListener('keydown', window.util.onPopupEscPress);
  };

  var setGaleryLiseners = function () {
    document.querySelector('.pictures').addEventListener('click', onPictureClick);
    document.querySelector('#upload-file').addEventListener('change', onFileInputClick);
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

  window.backend.getData(LINK_TO_PICTURES, drawPictures, onLoadError);
  setGaleryLiseners();
})();
