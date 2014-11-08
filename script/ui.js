function hideMessaging() {
  $('#messageContainer').each(function(index, element){
    element.classList.add('hidden');
  });
}

function showMessaging() {
    $('#messageContainer').each(function(index, element) {
    element.classList.remove('hidden');
    $(this).click(function() {
      hideMessaging();
      $(this).bind('transitionend', function() {
        clearMessage();
      });
    });
  });
}

function addToMessage(aMessage) {
  var currentMessage = $('#message').innerHTML;
  if (currentMessage) {
    $('#message').html(currentMessage + '<br />' + aMessage);
  } else {
    $('#message').html(aMessage);
  }
}

function clearMessage() {
  $('#message').html('');
}
