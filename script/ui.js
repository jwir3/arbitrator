var currentMessageTimeoutId = -1;
function hideMessaging() {
  $('#messageContainer').each(function(index, element){
    element.classList.add('hidden');
  });
}

function slideUpMessageAndHide() {
  if (currentMessageTimeoutId > 0) {
    clearTimeout(currentMessageTimeoutId);
  }

  hideMessaging();
}

function showMessaging() {
  $('#messageContainer').each(function(index, element) {
  element.classList.remove('hidden');
  $(this).click(function() {
    slideUpMessageAndHide();
  });

  if (currentMessageTimeoutId > 0) {
    clearTimeout(currentMessageTimeoutId);
  }

  currentMessageTimeoutId = setTimeout(slideUpMessageAndHide, 5000);
});
}

function addToMessage(aMessage) {
  $('#message').html(aMessage);
  showMessaging();
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

/**
 * Show all aliases currently in local storage in the preference UI area.
 */
function showAliases() {
    var aliasedGroups = Arbitrator.getGroupAliases();
    for (var prop in aliasedGroups) {
      if (aliasedGroups.hasOwnProperty(prop)) {
        var groupAlias = aliasedGroups[prop];
        addAliasUIFor(prop, groupAlias);
      }
    }

    $('#prefArea').show();
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
  $('#aliasPrefs').append(uiLine);
}
