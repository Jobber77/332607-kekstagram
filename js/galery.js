// galery.js
'use strict';

(function () {
  //  #region constants
  var MIN_LIKES_AMOUNT = 15;
  var MAX_LIKES_AMOUNT = 200;
  var MAX_COMMENTS_AMOUNT = 20;
  var MIN_COMMENTS_AMOUNT = 0;
  var IMG_ON_MAIN_AMOUNT = 25;
  //  endregion
  var mockComments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var mockDescription = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var getMockImgList = function () {
    var mockImgList = [];
    for (var i = 0; i < IMG_ON_MAIN_AMOUNT; i++) {
      var img = {};
      img.url = 'photos/' + (i + 1) + '.jpg';
      img.likes = window.util.getRandomNumber(MIN_LIKES_AMOUNT, MAX_LIKES_AMOUNT);
      img.comments = window.util.getRandomList(mockComments, window.util.getRandomNumber(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT), true);
      img.description = window.util.getRandomList(mockDescription, 1, false);
      img.id = i;
      mockImgList.push(img);
    }
    return mockImgList;
  };

  var drawPictures = function (pictures) {
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
      fragment.appendChild(aElementToClone);
    });
    document.querySelector('.pictures').appendChild(fragment);
  };

  var findClickedPictureObject = function (clickedDOMelement) {
    var id = clickedDOMelement.pictureId;
    var clickedImage = {};
    for (var i = 0; i < mockImgList.length; i++) {
      if (mockImgList[i].id === id) {
        clickedImage = mockImgList[id];
      }
    }
    return clickedImage;
  };

  var onPictureClick = function (evt) {
    var target = evt.target.closest('a');
    if (target) {
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

  var mockImgList = getMockImgList();
  drawPictures(mockImgList);
  setGaleryLiseners();
})();
