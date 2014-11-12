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

function addAlias(aGroupName) {
    var alias = $('#alias-' + aGroupName).val();
    Arbitrator.addGroupAlias(aGroupName, alias);
    $('#msg-' + aGroupName).css('color', 'green')
      .html("&#x2713; Alias added!")
      .show();
    setTimeout(function() {
      $('#msg-' + aGroupName).fadeOut(function() {
        $(this).html('');
      });
    }, 1000);
}

function addAliasUIFor(aGroupName, aGroupAlias) {
  // if a UI already exists for this groupName, then don't show it.
  if ($('#alias-' + aGroupName).length) {
      return;
  }

  var input1 = '<input class="aliasUI" disabled type="text" id="' + aGroupName + '" length="10" value="' + aGroupName + '" />';
  var input2 = '<input class="aliasUI" type="text" id="alias-' + aGroupName + '" length="10" value="' + aGroupAlias + '" />';
  var submit = '<button class="aliasUI" onclick="addAlias(\'' + aGroupName + '\')">Add</button>';
  var msgArea = '<span id="msg-' + aGroupName + '" class="inputMessageArea"></span>';
  var uiLine = '<div class="aliasInputLine">' + input1 + input2 + submit + msgArea + '</div>';
  $('#prefArea').append(uiLine);
}
