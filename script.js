var $userInputTitle = $('.user-form__input-title');
var $userInputBody = $('.user-form__input-body ');
var $inputButton = $('.user-form__button-save');

$('user-form__input-title, .user-form__input-body').on('keyup', disableBtn);
$('ul').on('blur', '.ideabox__li-title', editTitleContent);
$('ul').on('blur','.ideabox__li-body', editBodyContent);
$('.ideabox__input-search').on('keyup', filter);
$($inputButton).on('click', createIdea);
$('ul').on('click', deleteCard);
$('ul').on('click', downVote);
$('ul').on('click', upVote);

$(document).ready(persistUserData());

function Idea(userInputTitle, userInputBody) {
  this.id = Date.now();
  this.title = $userInputTitle.val();
  this.body = $userInputBody.val();
  this.quality = ['swill', 'plausible', 'genius'];
  this.qualityCounter = 0;
}

Idea.prototype.prepend = function() {
  $('ul').prepend(`
    <li class="ideabox__li" id="${this.id}">
      <h2 id="idea.title" class="ideabox__li-title" contenteditable="true">${this.title}</h2>
      <button class="ideabox__button-delete"></button>
      <p class="ideabox__li-body" contenteditable="true" id="idea.body">${this.body}</p>
      <button class="upvote"></button>
      <button class="downvote"></button>
      <p class="ideabox__li-quality">quality:<span id="idea.quality">${this.quality[this.qualityCounter]}</span></p>
    </li>`)
}

function createIdea(event, userInputTitle, userInputBody) {
  event.preventDefault();
  var newIdea = new Idea();
    newIdea.prepend();
    $('.user-form__input').val('');
    disableBtn();
    
    sendToStorage(newIdea);
    getFromStorage(newIdea);
}

function disableBtn() {
  if($('.user-form__input-title').val() === '' || $('.user-form__input-body').val() === ''){
    $('.user-form__button-save').attr('disabled', true);
  } else {
    $('.user-form__button-save').attr('disabled', false);
  }
}

function upVote(e) {
  if(e.target && e.target.matches('.upvote')) {
    var object = getFromStorage(e.target.parentNode.id);
    upVoteRange(object);
    e.target.nextSibling.nextSibling.nextSibling.nextSibling.lastChild.previousSibling.innerText = object.quality[object.qualityCounter];
    console.log(e.target.nextSibling.nextSibling.nextSibling);
    sendToStorage(object);
  }
}

function downVote(e) {
  if(e.target && e.target.matches('.downvote')) {
    var object = getFromStorage(e.target.parentNode.id);
    downVoteRange(object);
    e.target.nextSibling.nextSibling.lastChild.previousSibling.innerText = object.quality[object.qualityCounter];
    sendToStorage(object);
  }
}

function upVoteRange(obj) {
  if(obj.qualityCounter < 2) {
    obj.qualityCounter++;
  }
}

function downVoteRange(obj) {
  if(obj.qualityCounter > 0) {
    obj.qualityCounter--;
  }
}

function deleteCard(e) {
  if(e.target && e.target.matches('.ideabox__button-delete')){
    event.target.closest('li').remove();
    localStorage.removeItem(e.target.parentNode.id);
  }
}

function sendToStorage(newIdea) {
  var storeNewObject = newIdea;
  var stringifyNewObject = JSON.stringify(storeNewObject);
  localStorage.setItem(newIdea.id, stringifyNewObject);
}

function getFromStorage(newIdea) {
  var retrieveObject = localStorage.getItem(newIdea);
  var parsedObject = JSON.parse(retrieveObject);
  return parsedObject;
}

function editTitleContent() {
  var parsedObject = getFromStorage($(this).parent().attr('id'));
  parsedObject.title = $(this).text();
  sendToStorage(parsedObject);
}

function editBodyContent() {
  var parsedObject = getFromStorage($(this).parent().attr('id'));
  parsedObject.body = $(this).text();
  sendToStorage(parsedObject)
}

function persistUserData() {
  for (var i = 0 ; i < localStorage.length ; i++) {
    var ideaFromStorage = getFromStorage(localStorage.key(i));
    $('ul').prepend(`
      <li class="ideabox__li"id=${ideaFromStorage.id}>
        <h2 id="idea.title" class="ideabox__li-title" contenteditable="true">${ideaFromStorage.title}</h2>
        <button class="ideabox__button-delete">
        </button>
        <p class="ideabox__li-body" contenteditable="true" id="idea.body">${ideaFromStorage.body}</p>
        <button class="upvote"></button>
        <button class="downvote"></button>
        <p class="ideabox__li-quality">quality:<span id="idea.quality">${ideaFromStorage.quality[ideaFromStorage.qualityCounter]}</span></p>
      </li>`);
  }
}

function filter(e) {
  console.log('eyo');
  var ideaBody = $('.ideabox__li-body');
  var ideaTitle = $('.ideabox__li-title');
  var search = $('.ideabox__input-search').val();
  for( var i = 0 ; i <= $('.ideabox__li').length ; i++) {
    if(ideaBody[i].innerText.includes(search) === true || ideaTitle[i].innerText.includes(search) === true){
      $('.ideabox__li')[i].style.display = 'block';
    } else {
      $('.ideabox__li')[i].style.display = 'none';
    }
  }
}



