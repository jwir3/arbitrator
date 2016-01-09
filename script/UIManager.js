module.exports = UIManager;

var $ = require('jquery');
var PreferenceStore = require('./PreferenceStore');
var LocationService = require('./LocationService');
var locService = new LocationService();
var Place = require('./Place');
var Arbitrator = require('./Arbitrator');
var ArbitratorGoogleClient = require('./arbitrator-google-client');

function UIManager() {
  this.mCurrentMessageTimeoutId = -1;
  this._setPreferenceOnClickHandlers();
  this._setHeaderScrollListener();
  this._setNavDrawerOnClickHandlers();
  this._setArbitrateOnClickHandler();
  this._setLogoutOnClickHandler();
}

UIManager.prototype = {
  /**
   * Perform functionality when the user clicks the 'Submit' button to indicate
   * they wish to invoke arbitrator's functionality.
   */
  onArbitrate: function() {
    var scheduleText = $('#schedule').val();
    var arb = new Arbitrator(scheduleText);
    var calSelectionElement = document.getElementById('calendarList');
    var selectedId = calSelectionElement[calSelectionElement.selectedIndex].id;
    arb.adjustGamesOrSubmitToCalendar(selectedId);

    this.refreshPreferences();
  },

  /**
   * Hide the messaging UI that slides down from the top of the screen.
   */
  hideMessaging: function() {
    $('#messageContainer').each(function(index, element){
      element.classList.add('hidden');
    });
  },

  /**
   * Perform an animation that slides the top messaging UI up and then hides it.
   */
  slideUpMessageAndHide: function() {
    if (this.mCurrentMessageTimeoutId > 0) {
      clearTimeout(this.mCurrentMessageTimeoutId);
    }

    this.hideMessaging();
  },

  /**
   * Show the messaging UI at the top of the screen.
   */
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

  /**
   * Set the message displayed by the messaging UI at the top of the screen.
   *
   * @param aMessage The message to show within the messaging UI.
   */
  setMessage: function(aMessage) {
    $('#message').html(aMessage);
    this.showMessaging();
  },

  /**
   * Add a temporary indicator that a preference has been set appropriately.
   *
   * @param aPrefName The name of the preference that was set.
   */
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

  /**
   * Refresh the preference UI from local storage and populate the UI
   * accordingly.
   */
  refreshPreferences: function() {
    var prefStore = new PreferenceStore();
    this.refreshTimePreferences();
    this.refreshGroupPreferences();
    this.refreshLocationPreferences();
  },

  /**
   * Refresh the preference UI from local storage for all time preferences.
   */
  refreshTimePreferences: function() {
    var prefStore = new PreferenceStore();
    var timePrefs = prefStore.getAllTimePreferences();
    for (var key in timePrefs) {
      if (timePrefs.hasOwnProperty(key)) {
        $('#timePref-' + key).val(timePrefs[key]);
      }
    }
  },

  /**
   * Refresh the preference UI from local storage for all location preferences.
   */
  refreshLocationPreferences: function() {
      var prefStore = new PreferenceStore();
      var locPrefs = prefStore.getAllLocationPreferences();
      for (var key in locPrefs) {
        if (locPrefs.hasOwnProperty(key)) {
          this.addLocationPreference(prefStore.getLocationPreference(key));
        }
      }
  },

  /**
   * Refresh the preference UI from local storage for all group/alias
   * preferences.
   */
  refreshGroupPreferences: function() {
    var prefStore = new PreferenceStore();
    var aliasedGroups = prefStore.getAllGroupAliases();
    for (var prop in aliasedGroups) {
      if (aliasedGroups.hasOwnProperty(prop)) {
        var groupAlias = aliasedGroups[prop];
        this.addAliasUIFor(prop, groupAlias);
      }
    }
  },

  /**
   * Set a time preference from the UI an propagate this preference to the
   * preference store.
   *
   * @param aTimePrefName The name of the time preference to set from the UI.
   */
  setTimePreferenceFromUI: function(aTimePrefName) {
      var timePrefVal = $('#timePref-' + aTimePrefName).val();
      var prefName = '';
      var prefStore = new PreferenceStore();
      prefStore.addTimePreference(aTimePrefName, timePrefVal);
      this.acknowledgePreference(aTimePrefName);
  },

  /**
   * Add an alias UI element for a given group name and alias.
   *
   * @param aGroupName The name of the group (as specified in the input) for which
   *        an alias was created.
   * @param aGroupAlias The name of the alias to use for this group.
   */
  addAliasUIFor: function(aGroupName, aGroupAlias) {
    // if a UI already exists for this groupName, then don't show it.
    if ($('#alias-' + aGroupName).length) {
        return;
    }

    var input1 = '<input class="aliasUI" disabled type="text" id="' + aGroupName + '" length="10" value="' + aGroupName + '" />';
    var input2 = '<input class="aliasUI" type="text" id="alias-' + aGroupName + '" length="10" value="' + aGroupAlias + '" />';
    var submit = '<button class="aliasUI aliasAddButton" data-groupName="' + aGroupName + '">Add</button>';
    var msgArea = '<span id="msg-' + aGroupName + '" class="inputMessageArea"></span>';
    var uiLine = '<div>' + input1 + input2 + submit + msgArea + '</div>';
    $('#aliasInputs').append(uiLine);
    this._setAliasPreferenceOnClickHandlers();
  },

  /**
   * Add an alias to the preference store for a given group name.
   *
   * @param aGroupName The name of the group for which the alias should be
   *        retrieved from the UI and placed in the preference store.
   */
  addAliasToPrefStore: function(aGroupName) {
      var alias = $('#alias-' + aGroupName).val();
      var prefStore = new PreferenceStore();
      prefStore.addGroupAlias(aGroupName, alias);
      this.acknowledgePreference(aGroupName);
  },

  setLocationPreference: function(aLocationPrefKey, aLocationPrefName) {
    var address = $('#locationPref-' + aLocationPrefKey).val();

    var prefName = '';
    var prefStore = new PreferenceStore();
    console.log("Adding preference with address: " + address);
    prefStore.addLocationPreference(new Place(aLocationPrefKey, aLocationPrefName, address));

    this.acknowledgePreference(aLocationPrefName);
  },

  addLocationPreference: function(aPlace) {
    var labelSet = $('<div class="labelSet"></div>');
    var labelElement = $('<label for="locationPref-' + aPlace.getShortName() + '">' + aPlace.getName() + '</label>');
    labelSet.append(labelElement);
    var container = $('<div class="inputMessageAreaFloatContainer"><span id="msg-locationPref-' + aPlace.getShortName() + '" class="inputMessageArea"></span></div>');
    labelSet.append(container);
    var deleteButton = $('<button id="deleteLocationPref-' + aPlace.getShortName() + '" onClick="deleteLocationPref(\'' + aPlace.getShortName() + '\')">Remove</button>');
    labelSet.append(deleteButton);
    var onClickHandler = "setLocationPref('" + aPlace.getShortName() + "', '" + aPlace.getName() + "');";

    var setButton = $('<button class="locationSetButton" data-locationname="' + aPlace.getShortName() + '">Set</button>');
    labelSet.append(setButton);
    var placeholderText = 'Enter address for ' + aPlace.getName();
    if (aPlace.getAddress()) {
      placeholderText = aPlace.getAddress();
    }

    var textInput = $('<input type="text" class="locationTextInput" id="locationPref-' + aPlace.getShortName() + '" placeholder="' + placeholderText +'" />');
    labelSet.append(textInput);
    $('#locationPrefs > .inputSet').append(labelSet);

    locService.enableAutoCompleteForElement(document.getElementById('locationPref-' + aPlace.getShortName()));
    this._setLocationPreferenceOnClickHandlers();
  },

  logout: function() {
    var prefStore = new PreferenceStore();
    prefStore.removeUserId();
    location.reload();
  },

  /**
   * Set all onClick() handlers for preference UI elements.
   */
  _setPreferenceOnClickHandlers: function() {
    this._setTimePreferenceOnClickHandlers();
    this._setAliasPreferenceOnClickHandlers();
    this._setLocationPreferenceOnClickHandlers();
  },

  /**
   * Set the onClick() handlers for time preferences.
   */
  _setTimePreferenceOnClickHandlers: function() {
    var that = this;
    $('#setPriorToStart').click(function() {
      that.setTimePreferenceFromUI('priorToStart');
    });

    $('#setGameLength').click(function() {
      that.setTimePreferenceFromUI('gameLength');
    });

    $('#setConsecutiveGames').click(function() {
      that.setTimePreferenceFromUI('consecutiveGames');
    });
  },

  /**
   * Set the onClick() handlers for alias/group preferences.
   */
  _setAliasPreferenceOnClickHandlers: function() {
    var that = this;
    var prefStore = new PreferenceStore();
    $('.aliasAddButton').click(function() {
      that.addAliasToPrefStore($(this).data('groupname'));
    });
  },

  _setLocationPreferenceOnClickHandlers: function() {
    var that = this;
    $('.locationSetButton').each(function() {
      $(this).click(function() {
        that.setLocationPreference($(this).data('locationname'));
      });
    });
  },

/**
 * Enable the scroll listener so we can determine whether to show the box
 * shadow beneath the app bar. If the view is scrolled, the app bar will have
 * a shadow underneath it. Otherwise, the app bar will have no shadow.
 */
  _setHeaderScrollListener: function() {
    $(window).scroll(function() {
      if ($(this).scrollTop() == 0) {
          $('header').css({'box-shadow': 'none'});
      } else {
        $('header').css({
          'box-shadow': '0px 2px 10px rgba(0, 0, 0, 0.2)'
        });
      }
    });
  },

  /**
   * Set the onClick() handler for the main "arbitrate" button.
   */
  _setArbitrateOnClickHandler: function() {
    $('#arbitrate-button').click(function () {
      this.onArbitrate();
    });
  },

  /**
   * Set the onClick() handler for the logout link.
   */
   _setLogoutOnClickHandler: function() {
     $('#logoutLink').click(function() {
       this.logout();
     });
   },

  /**
   * Set the onClick() handler for the navigation drawer button (i.e. the
   * hamburger icon). Also sets up all the navigation drawer item onClick()
   * handlers.
   */
  _setNavDrawerOnClickHandlers: function() {
    $('#hamburger').click(function() {
      $('#nav-drawer').css({
        'transform': 'translate(0px, 0px)'
      });
    });

    $('.nav-drawer-header').click(function() {
      $('#nav-drawer').css({
        'transform': 'translate(-256px, 0px)'
      });
    });

    $('#nav-drawer-locations').click(function() {
      $('#nav-drawer').css({
        'transform': 'translate(-256px, 0px)'
      });

      setTimeout(function() {
        window.location = 'locations.html';
      }, 220); // The animation takes ~218ms.
    });

    // Set the text of the nav drawer header
//    $('li.nav-drawer-header').text($('head').find('title').text());
  }
};
//
// function deleteLocationPref(aLocationKey) {
//   var prefStore = new PreferenceStore();
//   prefStore.removeLocationPreference(aLocationKey);
//   $('#locationPref-' + aLocationKey).parent().fadeOut(300, function () {
//     $(this).remove();
//   });
// }
