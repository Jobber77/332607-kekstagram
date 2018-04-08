'use strict';

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

var getRandomList = function (comments, number, isComments) {
  var commentList = [];
  for (var i = 0; i < number; i++) {
    //  random choose amount of composite comments
    var compositeNumber = isComments ? Math.round(Math.random() + 1) : 1;
    compositeNumber = compositeNumber < comments.length ? compositeNumber : comments.length;
    var comment = '';
    for (var j = 0; j < compositeNumber; j++) {
      comment += comments[Math.round(Math.random() * (comments.length - 1))];
    }
    commentList.push(comment);
  }
  return commentList;
};

var getMockImgList = function () {
  var mockImgList = [];
  for (var i = 1; i <= 25; i++) {
    var img = {};
    img.url = 'photos/' + i + '.jpg';
    img.likes = Math.round(Math.random() * 185 + 15);
    img.comments = getRandomList(mockComments, Math.round(Math.random() * 20), true);
    img.description = getRandomList(mockDescription, 1, false);
    mockImgList.push(img);
  }
  return mockImgList;
};

var createDOMElement = function (type, classes, textContent) {
  var element = document.createElement(type);
  //  check if classes is Array
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
    link.href = pictures[i].url;
    // <img> element
    var image = createDOMElement('img', 'picture__img');
    image.src = pictures[i].url;
    image.width = 182;
    image.height = 182;
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
    fragment.appendChild(link);
  }
  document.querySelector('.pictures').appendChild(fragment);
};

var createComments = function (amount, image) {
  var commentFragment = document.createDocumentFragment();
  for (var i = 0; i < amount; i++) {
    var li = createDOMElement('li', ['social__comment', 'social__comment--text']);
    var img = createDOMElement('img', 'social__picture');
    img.src = 'img/avatar-' + Math.round(Math.random() * 5 + 1) + '.svg';
    img.alt = 'Аватар комментатора фотографии';
    img.width = 35;
    img.height = 35;
    commentFragment.appendChild(li);
    li.appendChild(img);
    li.appendChild(document.createTextNode(image.comments[i]));
  }
  return commentFragment;
};

var showBigPicture = function (image) {
  document.querySelector('.big-picture').classList.toggle('hidden');
  document.querySelector('.big-picture__img img').src = image.url;
  document.querySelector('.big-picture__social .likes-count').textContent = image.likes;
  document.querySelector('.big-picture__social .comments-count').textContent = image.comments.length;
  document.querySelector('.social .social__comments').appendChild(createComments(3, image));
  document.querySelector('.social__comment-count').classList.toggle('visually-hidden');
  document.querySelector('.social__comment-loadmore').classList.toggle('visually-hidden');
};


var mockImgList = getMockImgList();
drawPictures(mockImgList);
showBigPicture(mockImgList[0]);
