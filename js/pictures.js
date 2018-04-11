'use strict';

//  #region constants
var MIN_LIKES_AMOUNT = 15;
var MAX_LIKES_AMOUNT = 200;
var MAX_COMMENTS_AMOUNT = 20;
var MIN_COMMENTS_AMOUNT = 0;
var IMG_ON_MAIN_AMOUNT = 25;
var IMG_MAIN_WIDTH = 182;
var IMG_MAIN_HEIGHT = 182;
var IMG_AVATAR_MIN_INDEX = 1;
var IMG_AVATAR_MAX_INDEX = 6;
var IMG_AVATAR_WIDTH = 35;
var IMG_AVATAR_HEIGHT = 35;
var IMG_TO_SHOW_PER_CLICK = 5;
var ESC_KEYCODE = 27;
//  endregion

//  #region query variables
var bigPicture = document.querySelector('.big-picture');
var bigPictureCommentsContainer = document.querySelector('.social .social__comments');
var imgPreview = document.querySelector('.img-upload__preview > img');

//  #endregion

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

var getMockImgList = function () {
  var mockImgList = [];
  for (var i = 0; i < IMG_ON_MAIN_AMOUNT; i++) {
    var img = {};
    img.url = 'photos/' + (i + 1) + '.jpg';
    img.likes = getRandomNumber(MIN_LIKES_AMOUNT, MAX_LIKES_AMOUNT);
    img.comments = getRandomList(mockComments, getRandomNumber(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT), true);
    img.description = getRandomList(mockDescription, 1, false);
    img.id = i;
    mockImgList.push(img);
  }
  return mockImgList;
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

var drawPictures = function (pictures) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    // <a> element
    var link = createDOMElement('a', 'picture__link');
    link.href = '#';
    // <img> element
    var image = createDOMElement('img', 'picture__img');
    image.src = pictures[i].url;
    image.width = IMG_MAIN_WIDTH;
    image.height = IMG_MAIN_HEIGHT;
    image.alt = 'Случайная фотография';
    link.appendChild(image);
    // <p> element
    var statsParagraph = createDOMElement('p', 'picture__stats');
    link.appendChild(statsParagraph);
    // <span> comments element
    var commentSpan = createDOMElement('span', ['picture__stat', 'picture__stat--comments'], pictures[i].comments.length);
    statsParagraph.appendChild(commentSpan);
    // <span> likes element
    var likeSpan = createDOMElement('span', ['picture__stat', 'picture__stat--likes'], pictures[i].likes);
    statsParagraph.appendChild(likeSpan);
    // hidden span for storing id
    var idSpan = createDOMElement('span', ['hidden', 'picture__id'], i.toString());
    statsParagraph.appendChild(idSpan);
    fragment.appendChild(link);
  }
  document.querySelector('.pictures').appendChild(fragment);
};

var createComments = function (amount, image) {
  var commentFragment = document.createDocumentFragment();
  var showAmount = amount < image.comments.length ? amount : image.comments.length;
  for (var i = 0; i < showAmount; i++) {
    var li = createDOMElement('li', ['social__comment', 'social__comment--text']);
    var img = createDOMElement('img', 'social__picture');
    img.src = 'img/avatar-' + getRandomNumber(IMG_AVATAR_MIN_INDEX, IMG_AVATAR_MAX_INDEX) + '.svg';
    img.alt = 'Аватар комментатора фотографии';
    img.width = IMG_AVATAR_WIDTH;
    img.height = IMG_AVATAR_HEIGHT;
    commentFragment.appendChild(li);
    li.appendChild(img);
    li.appendChild(document.createTextNode(image.comments[i]));
  }
  return commentFragment;
};

var fillBigPicture = function (imgObject) {
  document.querySelector('.big-picture__img img').src = imgObject.url;
  document.querySelector('.big-picture__social .likes-count').textContent = imgObject.likes;
  document.querySelector('.big-picture__social .comments-count').textContent = imgObject.comments.length;
  bigPictureCommentsContainer.innerHTML = '';
  bigPictureCommentsContainer.appendChild(createComments(IMG_TO_SHOW_PER_CLICK, imgObject));
};

var showBigPicture = function (image) {
  fillBigPicture(image);
  bigPicture.classList.remove('hidden');
  document.querySelector('#picture-cancel').addEventListener('click', hideBigPicture);
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
};

var hideBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  document.querySelector('#picture-cancel').removeEventListener('click', hideBigPicture);
  killFilterLiseners();
};

var showEditorForm = function () {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  document.querySelector('#upload-cancel').addEventListener('click', hideEditorForm);
  setFilterLiseners();
};

var hideEditorForm = function () {
  document.querySelector('.img-upload__overlay').classList.add('hidden');
  document.querySelector('#upload-file').value = '';
  document.removeEventListener('keydown', onPopupEscPress);
  document.querySelector('#upload-cancel').removeEventListener('click', hideEditorForm);
};

var findClickedObject = function (clickedDOMelement) {
  var id = parseInt(clickedDOMelement.querySelector('.picture__id').textContent, 10);
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
    showBigPicture(findClickedObject(target));
    document.addEventListener('keydown', onPopupEscPress);
  }
};

var onFileInputClick = function () {
  showEditorForm();
  document.addEventListener('keydown', onPopupEscPress);
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hideBigPicture();
    hideEditorForm();
  }
};

var clearFilters = function (img) {
  img.classList.remove('effects__preview--none');
  img.classList.remove('effects__preview--chrome');
  img.classList.remove('effects__preview--sepia');
  img.classList.remove('effects__preview--marvin');
  img.classList.remove('effects__preview--phobos');
  img.classList.remove('effects__preview--heat');
};

var setFilter = function (img, filterName) {
  var filterClass = 'effects__preview--none';
  switch (filterName) {
    case 'chrome':
      filterClass = 'effects__preview--chrome';
      break;
    case 'sepia':
      filterClass = 'effects__preview--sepia';
      break;
    case 'marvin':
      filterClass = 'effects__preview--marvin';
      break;
    case 'phobos':
      filterClass = 'effects__preview--phobos';
      break;
    case 'heat':
      filterClass = 'effects__preview--heat';
      break;
  }
  clearFilters(img);
  img.classList.add(filterClass);
};

var onFilterClick = function (env) {
  if (env.target.classList.contains('effects__preview--chrome')) {
    setFilter(imgPreview, 'chrome');
  } else if (env.target.classList.contains('effects__preview--sepia')) {
    setFilter(imgPreview, 'sepia');
  } else if (env.target.classList.contains('effects__preview--marvin')) {
    setFilter(imgPreview, 'marvin');
  } else if (env.target.classList.contains('effects__preview--phobos')) {
    setFilter(imgPreview, 'phobos');
  } else if (env.target.classList.contains('effects__preview--heat')) {
    setFilter(imgPreview, 'heat');
  } else {
    setFilter(imgPreview, 'none');
  }
};


var setFilterLiseners = function () {
  var filters = document.querySelectorAll('.effects__preview');
  for (var i = 0; i < filters.length; i++) {
    filters[i].addEventListener('click', onFilterClick);
  }
};

var killFilterLiseners = function () {
  var filters = document.querySelectorAll('.effects__preview');
  for (var i = 0; i < filters.length; i++) {
    filters[i].removeEventListener('click', onFilterClick);
  }
};

document.querySelector('.pictures').addEventListener('click', onPictureClick);
document.querySelector('#upload-file').addEventListener('change', onFileInputClick);

var mockImgList = getMockImgList();
drawPictures(mockImgList);
