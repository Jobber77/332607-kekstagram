'use strict';

//  #region constants
var MIN_LIKES_AMOUNT = 15;
var MAX_LIKES_AMOUNT = 200;
var MAX_COMMENTS_AMOUNT = 20;
var MIN_COMMENTS_AMOUNT = 0;
var IMG_ON_MAIN_AMOUNT = 25;
var IMG_AVATAR_MIN_INDEX = 1;
var IMG_AVATAR_MAX_INDEX = 6;
var IMG_AVATAR_WIDTH = 35;
var IMG_AVATAR_HEIGHT = 35;
var IMG_TO_SHOW_PER_CLICK = 5;
var ESC_KEYCODE = 27;
var FILTER_MAX_VALUE_GRAYSCALE = 1;
var FILTER_MAX_VALUE_SEPIA = 1;
var FILTER_MAX_VALUE_INVERT = 100;
var FILTER_MAX_VALUE_BLUR = 5;
var FILTER_MAX_VALUE_BRIGHTNESS = 3;
//  endregion

//  #region query variables
var bigPicture = document.querySelector('.big-picture');
var bigPictureCommentsContainer = document.querySelector('.social .social__comments');
var imgPreview = document.querySelector('.img-upload__preview > img');
var selectedfilter = 'none';
var filterSlider = document.querySelector('.img-upload__scale');
var resizeValue = document.querySelector('.resize__control--value');
var textAreaUpload = document.querySelector('.text__description');
var inputTagUpload = document.querySelector('.text__hashtags');
var inputFile = document.querySelector('#upload-file');
var pin = document.querySelector('.scale__pin');
var scaleLine = document.querySelector('.scale__line');
var scaleValue = document.querySelector('.scale__value');
var scaleLevel = document.querySelector('.scale__level');

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

var createComments = function (amount, image) {
  var commentFragment = document.createDocumentFragment();
  var showAmount = amount < image.comments.length ? amount : image.comments.length;
  for (var i = 0; i < showAmount; i++) {
    var li = createDOMElement('li', ['social__comment', 'social__comment--text']);
    var img = createDOMElement('img', 'social__picture');
    var randomImgNumber = getRandomNumber(IMG_AVATAR_MIN_INDEX, IMG_AVATAR_MAX_INDEX);
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
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
  document.querySelector('#picture-cancel').addEventListener('click', hideBigPicture);
};

var hideBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  document.querySelector('#picture-cancel').removeEventListener('click', hideBigPicture);
  killFilterLiseners();
};

var showEditorForm = function () {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  configureEditorForm();
  setFilterLiseners();
  setInputLiseners();
  document.querySelector('#upload-cancel').addEventListener('click', hideEditorForm);
};

var hideEditorForm = function () {
  document.querySelector('.img-upload__overlay').classList.add('hidden');
  document.querySelector('#upload-file').value = '';
  document.removeEventListener('keydown', onPopupEscPress);
  document.querySelector('#upload-cancel').removeEventListener('click', hideEditorForm);
  clearFilters(imgPreview);
  clearEditForm();
  killInputLiseners();
};

var clearEditForm = function () {
  inputTagUpload.value = '';
  textAreaUpload.value = '';
  inputFile.value = '';
};

var configureEditorForm = function () {
  resizeValue.value = '100%';
  hideSlider();
  document.querySelector('#effect-none').checked = true;
};

var setInputLiseners = function () {
  textAreaUpload.addEventListener('focus', onInputFocus);
  inputTagUpload.addEventListener('focus', onInputFocus);
  inputTagUpload.addEventListener('blur', onInputTagValidation);
  textAreaUpload.addEventListener('blur', onInputFocusLost);
  inputTagUpload.addEventListener('blur', onInputFocusLost);
};

var killInputLiseners = function () {
  textAreaUpload.removeEventListener('focus', onInputFocus);
  inputTagUpload.removeEventListener('focus', onInputFocus);
  inputTagUpload.removeEventListener('blur', onInputTagValidation);
  textAreaUpload.removeEventListener('blur', onInputFocusLost);
  inputTagUpload.removeEventListener('blur', onInputFocusLost);
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

var clearFilters = function (img) {
  img.classList.remove('effects__preview--none');
  img.classList.remove('effects__preview--chrome');
  img.classList.remove('effects__preview--sepia');
  img.classList.remove('effects__preview--marvin');
  img.classList.remove('effects__preview--phobos');
  img.classList.remove('effects__preview--heat');
  img.style.filter = '';
};

var setFilterLiseners = function () {
  var filters = document.querySelectorAll('.effects__radio');
  for (var i = 0; i < filters.length; i++) {
    filters[i].addEventListener('click', onFilterClick);
  }
  document.querySelector('.resize__control--minus').addEventListener('click', onButtonResizeMinus);
  document.querySelector('.resize__control--plus').addEventListener('click', onButtonResizePlus);
  pin.addEventListener('mousedown', onPinMove);
};

var killFilterLiseners = function () {
  var filters = document.querySelectorAll('.effects__radio');
  for (var i = 0; i < filters.length; i++) {
    filters[i].removeEventListener('click', onFilterClick);
  }
  document.querySelector('.resize__control--minus').removeEventListener('click', onButtonResizeMinus);
  document.querySelector('.resize__control--plus').removeEventListener('click', onButtonResizePlus);
  pin.removeEventListener('mousedown', onPinMove);
};

var showSlider = function () {
  filterSlider.classList.remove('hidden');
};

var hideSlider = function () {
  filterSlider.classList.add('hidden');
};

var setMainLiseners = function () {
  document.querySelector('.pictures').addEventListener('click', onPictureClick);
  document.querySelector('#upload-file').addEventListener('change', onFileInputClick);
};

var setFilter = function (img, filterName, filterIntensiveness) {
  var filterClass = 'effects__preview--none';
  var filterCSS = '';
  var level = filterIntensiveness;
  switch (filterName) {
    case 'chrome':
      filterClass = 'effects__preview--chrome';
      filterCSS = 'grayscale';
      level *= FILTER_MAX_VALUE_GRAYSCALE;
      break;
    case 'sepia':
      filterClass = 'effects__preview--sepia';
      filterCSS = 'sepia';
      level *= FILTER_MAX_VALUE_SEPIA;
      break;
    case 'marvin':
      filterClass = 'effects__preview--marvin';
      filterCSS = 'invert';
      level = level * FILTER_MAX_VALUE_INVERT + '%';
      break;
    case 'phobos':
      filterClass = 'effects__preview--phobos';
      filterCSS = 'blur';
      level = level * FILTER_MAX_VALUE_BLUR + 'px';
      break;
    case 'heat':
      filterClass = 'effects__preview--heat';
      filterCSS = 'brightness';
      level *= FILTER_MAX_VALUE_BRIGHTNESS;
      break;
  }
  clearFilters(img);
  img.classList.add(filterClass);
  if (filterCSS) {
    img.style.filter = filterCSS + '(' + level + ')';
  }
};

var onFilterClick = function (env) {
  var target = env.target.closest('input');
  showSlider();
  // check if object is found
  if (target) {
    switch (target.value) {
      case 'chrome':
        selectedfilter = 'chrome';
        break;
      case 'sepia':
        selectedfilter = 'sepia';
        break;
      case 'marvin':
        selectedfilter = 'marvin';
        break;
      case 'phobos':
        selectedfilter = 'phobos';
        break;
      case 'heat':
        selectedfilter = 'heat';
        break;
      case 'none':
        selectedfilter = 'none';
        hideSlider();
        break;
    }
  }
  setFilter(imgPreview, selectedfilter, 1);
  setInitialPinPostition();
};

var setInitialPinPostition = function () {
  //  почему в верстке не меняется атрибуты pin и scaleValue?
  pin.style.Left = scaleLine.offsetWidth + 'px';
  scaleLevel.style.width = scaleLine.offsetWidth + 'px';
  scaleValue.value = 1;
};

var onPictureClick = function (evt) {
  var target = evt.target.closest('a');
  if (target) {
    showBigPicture(findClickedPictureObject(target));
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

var onButtonResizeMinus = function () {
  var value = parseInt(resizeValue.value, 10);
  if (value > 0) {
    resizeValue.value = (value - 25) + '%';
    imgPreview.style.transform = 'scale(' + (value - 25) / 100 + ')';
  }
};

var onButtonResizePlus = function () {
  var value = parseInt(resizeValue.value, 10);
  if (value < 100) {
    resizeValue.value = (value + 25) + '%';
    imgPreview.style.transform = 'scale(' + (value + 25) / 100 + ')';
  }

};

var onInputFocus = function () {
  document.removeEventListener('keydown', onPopupEscPress);
};

var onInputFocusLost = function () {
  document.addEventListener('keydown', onPopupEscPress);
};

var onInputTagValidation = function (evt) {
  var input = evt.target.closest('input');
  var errorList = validateTags(input.value);
  if (errorList) {
    input.setCustomValidity(errorList.toString());
    input.style.border = '2px solid red';
  } else {
    input.setCustomValidity('');
  }
};

var validateTags = function (string) {
  var errors = [];
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

var onPinMove = function (evt) {
  evt.preventDefault();
  var startXCoords = evt.clientX;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    calculateNewPosition(moveEvt);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    calculateNewPosition(upEvt);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  var calculateNewPosition = function (moveEvent) {
    var shift = startXCoords - moveEvent.clientX;
    var newPosition = pin.offsetLeft - shift;
    if (newPosition <= 0) {
      newPosition = 0;
    }
    if (newPosition > scaleLine.offsetWidth) {
      newPosition = scaleLine.offsetWidth;
    }
    startXCoords = moveEvent.clientX;
    pin.style.left = newPosition + 'px';
    scaleLevel.style.width = newPosition + 'px';
    scaleValue.value = newPosition / scaleLine.offsetWidth;
    setFilter(imgPreview, selectedfilter, scaleValue.value);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

var mockImgList = getMockImgList();
drawPictures(mockImgList);
setMainLiseners();
