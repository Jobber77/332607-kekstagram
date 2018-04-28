// preview.js
'use strict';

(function () {
  //  #region constants
  var IMG_TO_SHOW_PER_CLICK = 5;
  var IMG_AVATAR_MIN_INDEX = 1;
  var IMG_AVATAR_MAX_INDEX = 6;
  var IMG_AVATAR_WIDTH = 35;
  var IMG_AVATAR_HEIGHT = 35;
  //  endregion

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCommentsContainer = document.querySelector('.social .social__comments');

  var fillImgPreview = function (imgObject) {
    document.querySelector('.big-picture__img img').src = imgObject.url;
    document.querySelector('.big-picture__social .social__caption').textContent = imgObject.comments[0];
    document.querySelector('.big-picture__social .likes-count').textContent = imgObject.likes;
    document.querySelector('.big-picture__social .comments-count').textContent = imgObject.comments.length;
    bigPictureCommentsContainer.innerHTML = '';
    bigPictureCommentsContainer.appendChild(createComments(IMG_TO_SHOW_PER_CLICK, imgObject));
  };
  var createComments = function (amount, image) {
    var commentFragment = document.createDocumentFragment();
    var showAmount = amount < image.comments.length ? amount : image.comments.length;
    for (var i = 0; i < showAmount; i++) {
      var li = window.util.createDOMElement('li', ['social__comment', 'social__comment--text']);
      var img = window.util.createDOMElement('img', 'social__picture');
      var randomImgNumber = window.util.getRandomNumber(IMG_AVATAR_MIN_INDEX, IMG_AVATAR_MAX_INDEX);
      img.src = 'img/avatar-' + randomImgNumber + '.svg';
      img.alt = 'Аватар комментатора фотографии';
      img.width = IMG_AVATAR_WIDTH;
      img.height = IMG_AVATAR_HEIGHT;
      commentFragment.appendChild(li);
      li.appendChild(img);
      li.appendChild(document.createTextNode(image.comments[i]));
    }
    return commentFragment;
  };

  //  expose
  var hideImgPreview = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', window.util.onPopupEscPress);
    document.querySelector('#picture-cancel').removeEventListener('click', window.preview.hideImgPreview);
  };
  var showImgPreview = function (image) {
    fillImgPreview(image);
    bigPicture.classList.remove('hidden');
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
    document.querySelector('#picture-cancel').addEventListener('click', window.preview.hideImgPreview);
  };
  window.preview = {
    hideImgPreview: hideImgPreview,
    showImgPreview: showImgPreview
  };
})();
