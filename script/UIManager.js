module.exports = UIManager;

var $ = require('jquery');
var PreferenceStore = require('./PreferenceStore.js');

function UIManager() {
  var that = this;
  this.mCurrentMessageTimeoutId = -1;
  $('#setPriorToStart').click(function() {
    that.setTimePreferenceFromUI('priorToStart');
  });

  $('#setGameLength').click(function() {
    that.setTimePreferenceFromUI('gameLength');
  });

  $('#setConsecutiveGames').click(function() {
    that.setTimePreferenceFromUI('consecutiveGames');
  });
}

UIManager.prototype = {
  hideMessaging: function() {
    $('#messageContainer').each(function(index, element){
      element.classList.add('hidden');
    });
  },

  slideUpMessageAndHide: function() {
    if (this.mCurrentMessageTimeoutId > 0) {
      clearTimeout(this.mCurrentMessageTimeoutId);
    }

    this.hideMessaging();
  },

  showMessaging: function() {
    var that = this;
    $('#messageContainer').each(function(index, element) {
      element.classList.remove('hidden');
      $(this).click(function() {
        that.slideUpMessageAndHide();
      });

      if (that.mCurrentMessageTimeoutId > 0) {
        clearTimeout(that.mCurrentMessageTimeoutId);
      }

      that.mCurrentMessageTimeoutId = setTimeout(that.slideUpMessageAndHide, 5000);
    });
  },

  setMessage: function(aMessage) {
    $('#message').html(aMessage);
    this.showMessaging();
  },

  acknowledgePreference: function(aPrefName) {
      $('#msg-' + aPrefName).css('color', 'green')
      .html("&#x2713; Preference set!")
      .show();
      setTimeout(function() {
        $('#msg-' + aPrefName).fadeOut(function() {
          $(this).html('');
        });
      }, 1000);
  },

  updatePreferencesFromStore: function() {
    this.updateTimePreferenceUIFromStore();
  },

  setTimePreferenceFromUI: function(aTimePrefName) {
      var timePrefVal = $('#timePref-' + aTimePrefName).val();
      var prefName = '';
      var prefStore = new PreferenceStore();
      prefStore.addTimePreference(aTimePrefName, timePrefVal);
      this.acknowledgePreference(aTimePrefName);
  },

  updateTimePreferenceUIFromStore: function() {
    var prefStore = new PreferenceStore();
    var timePrefs = prefStore.getAllTimePreferences();
    for (var key in timePrefs) {
      if (timePrefs.hasOwnProperty(key)) {
        $('#timePref-' + key).val(timePrefs[key]);
      }
    }
  }
};
// function setLocationPref(aLocationPrefKey, aLocationPrefName) {
//   var address = $('#locationPref-' + aLocationPrefKey).val();
//
//   var prefName = '';
//   var prefStore = new PreferenceStore();
//   console.log("Adding preference with address: " + address);
//   prefStore.addLocationPreference(new Place(aLocationPrefKey, aLocationPrefName, address));
//
//   $('#msg-' + aLocationPrefName).css('color', 'green')
//   .html("&#x2713; Preference set!")
//   .show();
//   setTimeout(function() {
//     $('#msg-' + aLocationPrefName).fadeOut(function() {
//       $(this).html('');
//     });
//   }, 1000);
// }
//
//
// function updateLocationPreferenceUI() {
//     var prefStore = new PreferenceStore();
//     var locPrefs = prefStore.getAllLocationPreferences();
//     console.log("Location prefs:");
//     console.log(locPrefs);
//     for (var key in locPrefs) {
//       if (locPrefs.hasOwnProperty(key)) {
//         addLocationPreference(prefStore.getLocationPreference(key));
//       }
//     }
// }
//
// function deleteLocationPref(aLocationKey) {
//   var prefStore = new PreferenceStore();
//   prefStore.removeLocationPreference(aLocationKey);
//   $('#locationPref-' + aLocationKey).parent().fadeOut(300, function () {
//     $(this).remove();
//   });
// }
//
// function addLocationPreference(aPlace) {
//   var labelSet = $('<div class="labelSet"></div>');
//   var labelElement = $('<label for="locationPref-' + aPlace.getShortName() + '">' + aPlace.getName() + '</label>');
//   labelSet.append(labelElement);
//   var container = $('<div class="inputMessageAreaFloatContainer"><span id="msg-locationPref-' + aPlace.getShortName() + '" class="inputMessageArea"></span></div>');
//   labelSet.append(container);
//   var deleteButton = $('<button id="deleteLocationPref-' + aPlace.getShortName() + '" onClick="deleteLocationPref(\'' + aPlace.getShortName() + '\')">Remove</button>');
//   labelSet.append(deleteButton);
//   var onClickHandler = "setLocationPref('" + aPlace.getShortName() + "', '" + aPlace.getName() + "');";
//
//   var setButton = $('<button id="setLocationPref-' + aPlace.getShortName() + '" onClick="' + onClickHandler + '">Set</button>');
//   labelSet.append(setButton);
//   var placeholderText = 'Enter address for ' + aPlace.getName();
//   if (aPlace.getAddress()) {
//     placeholderText = aPlace.getAddress();
//   }
//
//   var textInput = $('<input type="text" class="locationTextInput" id="locationPref-' + aPlace.getShortName() + '" placeholder="' + placeholderText +'" />');
//   labelSet.append(textInput);
//   $('#locationPrefs > .inputSet').append(labelSet);
//
//   initializeAutoCompleteForElement(document.getElementById('locationPref-' + aPlace.getShortName()));
// }
//
// function initializeAutoCompleteForElement(aLocationDomElement) {
//   var loc = new Location(aLocationDomElement);
// }
//
// function addAlias(aGroupName) {
//     var alias = $('#alias-' + aGroupName).val();
//     var prefStore = new PreferenceStore();
//     prefStore.addGroupAlias(aGroupName, alias);
//     $('#msg-' + aGroupName).css('color', 'green')
//       .html("&#x2713; Alias added!")
//       .show();
//     setTimeout(function() {
//       $('#msg-' + aGroupName).fadeOut(function() {
//         $(this).html('');
//       });
//     }, 1000);
// }
//
// /**
//  * Show all aliases currently in local storage in the preference UI area.
//  */
// function updateGroupAliasPreferenceUI() {
//   var prefStore = new PreferenceStore();
//   var aliasedGroups = prefStore.getAllGroupAliases();
//   for (var prop in aliasedGroups) {
//     if (aliasedGroups.hasOwnProperty(prop)) {
//       var groupAlias = aliasedGroups[prop];
//       addAliasUIFor(prop, groupAlias);
//     }
//   }
// }
//
// function addAliasUIFor(aGroupName, aGroupAlias) {
//   // if a UI already exists for this groupName, then don't show it.
//   if ($('#alias-' + aGroupName).length) {
//       return;
//   }
//
//   var input1 = '<input class="aliasUI" disabled type="text" id="' + aGroupName + '" length="10" value="' + aGroupName + '" />';
//   var input2 = '<input class="aliasUI" type="text" id="alias-' + aGroupName + '" length="10" value="' + aGroupAlias + '" />';
//   var submit = '<button class="aliasUI" onclick="addAlias(\'' + aGroupName + '\')">Add</button>';
//   var msgArea = '<span id="msg-' + aGroupName + '" class="inputMessageArea"></span>';
//   var uiLine = '<div>' + input1 + input2 + submit + msgArea + '</div>';
//   $('#aliasInputs').append(uiLine);
// }
