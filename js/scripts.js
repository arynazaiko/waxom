var $ = jQuery;
const USERS_URL = 'https://jsonware.com/json/eca3a5acd16092fa5b97f7b98a8c8dda.json';
var users = [];
var displayedProperties = [
  'firstname',
  'lastname', 
  'email',
  'phone',
  'country',
];

const USERS_NUMBER = 10;

$(document).ready(function () {
  $.getJSON(USERS_URL, {}, firstRender); // Download users json
  setHandlers();
});

function setHandlers() {
  setContactClickHandler();
  setUserModalClickHandler();
  setUserPropertyClickHandler();
  setWidgetCLickHandler();
}

function setWidgetCLickHandler() {
  $('.widget').click(function () {
    $('.widget').animate({
      left: '-=200',
    }, 'slow');
  });
}

function setContactClickHandler() {
  $('#contact').on('click', function () {
    $('#modalCenter').modal('show');
  });
}

function setUserModalClickHandler() {
  $('#userModal .submit-button').on('click', function () {
    var user = findUser($('#userModal').data('user-id')); 
    updateUser(user);
    renderUsersWidget(users);
  });
}

function setUserPropertyClickHandler() {
  $('#userModal .user-property').on('click', function () {
    $(this).hide();
    $(this).closest('.property-block').find('.user-property-ipnut').show();
  });
}

function updateUser(user) {
  displayedProperties.forEach(function (property) {
    user[property] = $('.user-' + property + '-input').val();
    $('.user-' + property + '-input').hide();
    $('.user-' + property).text($('.user-' + property + '-input').val());
    $('.user-' + property).show();
  });
}

function renderUsersWidget(users) {
  $('.widget .users-list').html('');
  var list = $('<ol>');
  
  users.slice(0, USERS_NUMBER).forEach(function(user) {
    list.append(createUserLi(user));    
  });
  
  $('.widget .users-list').append(list);
}

function createUserLi(user) {
  var fullName = user.firstname + ' ' + user.lastname;
  var a = $('<a>')
    .attr('href', '#')
    .text(fullName)
    .data('user-id', user.id)
    .on('click', handleUserClick);

  if (user.email == '') { $(a).css('color', 'red'); }

  return  $('<li>').append(a);
}

function handleUserClick(event) {
  event.preventDefault();
  var user = findUser($(event.target).data('user-id'));

  displayedProperties.forEach(function(property) {
    $('.user-' + property).text(user[property]);
    $('.user-' + property + '-input').val(user[property]);
  
    if (user[property] == '') {
      $('.user-' + property + '-input').show();
    }
  });
  
  
  $('#userModal').data('user-id', user.id);
  $('#userModal').modal('show');
}

function findUser(userId) {
  return users.find(function (user) {
    return userId === user.id;
  });
}

function firstRender(data) {
  users = removeRandomEmails(data);
  renderUsersWidget(users);
  console.log(users);
}

function removeRandomEmails(data) {
  return(
    data.map(function(user) { 
      if(Math.random() > 0.5) {
        user.email = '';
      }
      return user;
    })
  );
}


//
// for(key in obj) { console.log(obj[key]) }