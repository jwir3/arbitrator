function hideMessaging() {
  $('#message').each(function(index, element){
    element.classList.add('hidden');
  });
}

function showMessaging() {
  $('#message').each(function(index, element){
    element.classList.remove('hidden');
    $(this).click(function() {
      hideMessaging();
      setTimeout(clearMessage, 900);
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
