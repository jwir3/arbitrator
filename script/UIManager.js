module.exports = UIManager;

var $ = require('jquery');
var PreferenceStore = require('./PreferenceStore');
var LocationService = require('./LocationService');
var locService = new LocationService();
var Place = require('./Place');
var Arbitrator = require('./Arbitrator');
var ArbitratorGoogleClient = require('./arbitrator-google-client');
var StringUtils = require('./StringUtils');

function UIManager() {
}

UIManager.prototype = {
  mBackStack: new Array(),

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
  },

  setUIListeners: function() {
    this._setPreferenceOnClickHandlers();
    this._setHeaderScrollListener();
    this._setNavDrawerOnClickHandlers();
    this._setArbitrateOnClickHandler();
    this._setLogoutOnClickHandler();
    this._setDismissSnackBarOnClickHandler();
  },

  /**
   * Refresh the preference UI from local storage and populate the UI
   * accordingly.
   */
  refreshPreferences: function() {
    var prefStore = new PreferenceStore();
    this.refreshTimePreferences();
    this.refreshAliasPreferences();
    this.refreshLocationPreferences();

    this._setPreferenceOnClickHandlers();
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
  refreshAliasPreferences: function() {
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
  },

  /**
   * Add an alias UI element for a given group name and alias.
   *
   * @param aGroupName The name of the group (as specified in the input) for which
   *        an alias was created.
   * @param aGroupAlias The name of the alias to use for this group.
   */
  addAliasUIFor: function(aGroupName, aGroupAlias) {
    var that = this;
    $.get('html/alias-preference.partial.html', function(data) {
      var dataElement = $(data);
      dataElement.find('.originalName')
                 .data('actualname', aGroupName)
                 .attr('value', aGroupName);

      // If the group name is the same as the alias name, just assume we don't
      // have an alias set.
      if (aGroupAlias != aGroupName) {
        dataElement.find('.aliasName').attr('value', aGroupAlias);
      }

      $('#aliasInputs').append(dataElement);
      that._setAliasPreferenceOnClickHandlers();
    });
  },

  showSnackbar: function(aMessage) {
    $('#snackbar-message').text(aMessage);
    $('dialog.snackbar').show();
  },

  /**
   * Add an alias to the preference store for a given group name and alias.
   *
   * @param aGroupName The name of the group for which the alias should be
   *        retrieved from the UI and placed in the preference store.
   * @param aAliasName The name of the alias to use which should be stored in
   *        the preference store.
   */
  addAliasToPrefStore: function(aGroupName, aAliasName) {
      var prefStore = new PreferenceStore();
      prefStore.addGroupAlias(aGroupName, aAliasName);
      // this.acknowledgePreference(aGroupName);
      this.showSnackbar("Alias '" + aAliasName + "' set");
  },

  setLocationPreference: function(aLocationPrefKey, aLocationPrefName) {
    var address = $('#locationPref-' + aLocationPrefKey).val();

    var prefName = '';
    var prefStore = new PreferenceStore();
    prefStore.addLocationPreference(new Place(aLocationPrefKey, aLocationPrefName, address));

    this.showSnackbar("Address for '" + aLocationPrefName + "' set");
  },

  deleteLocationPreference: function(aLocationKey) {
    var prefStore = new PreferenceStore();
    prefStore.removeLocationPreference(aLocationKey);
  },

  addLocationPreference: function(aPlace) {
    var that = this;
    $.get('html/location-preference.partial.html', function(data) {
      var dataElement = $(data);
      var textInputId = 'locationPref-' + aPlace.getShortName();
      var placeholderText = 'Enter address for ' + aPlace.getName();
      if (aPlace.getAddress()) {
        placeholderText = aPlace.getAddress();
      }

      dataElement.find('label').attr('for', textInputId).text(aPlace.getName());
      dataElement.find('.locationTextInput').attr('id', textInputId)
                 .attr('placeholder', placeholderText);
      dataElement.find('.locationRemoveButton')
                 .data('locationshortname', aPlace.getShortName());
      dataElement.find('.locationSetButton')
                 .data('locationshortname', aPlace.getShortName())
                 .data('locationname', aPlace.getName());

      $('#locationInputs').append(dataElement);
      locService.enableAutoCompleteForElement(document.getElementById('locationPref-' + aPlace.getShortName()));
      that._setLocationPreferenceOnClickHandlers();
    });
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
      var minutes = $('#timePref-priorToStart').val();
      that.setTimePreferenceFromUI('priorToStart');
      that.showSnackbar('Calendar events will start ' + minutes + ' minutes prior to the game start');
    });

    $('#setGameLength').click(function() {
      var length = $('#timePref-gameLength').val();
      that.setTimePreferenceFromUI('gameLength');
      that.showSnackbar('Calendar events will be set to ' + length + ' minutes in length');
    });

    $('#setConsecutiveGames').click(function() {
      var consecutiveThresh = $('#timePref-consecutiveGames').val();
      that.setTimePreferenceFromUI('consecutiveGames');
      that.showSnackbar("Any games within " + consecutiveThresh + " hours of each other at the same location will be considered consecutive");
    });
  },

  /**
   * Set the onClick() handlers for alias/group preferences.
   */
  _setAliasPreferenceOnClickHandlers: function() {
    var that = this;
    var prefStore = new PreferenceStore();
    $('button.setAlias').each(function() {
      $(this).click(function() {
        var actualName = $(this).parent().find('.originalName').data('actualname');
        var aliasName = $(this).parent().find('.aliasName').val();
        that.addAliasToPrefStore(actualName, aliasName);
      });
    });
  },

  _setLocationPreferenceOnClickHandlers: function() {
    var that = this;
    $('.locationSetButton').each(function() {
      $(this).click(function() {
        that.setLocationPreference($(this).data('locationshortname'), $(this).data('locationname'));
      });
    });

    $('.locationRemoveButton').each(function() {
      $(this).click(function() {
        that.deleteLocationPreference($(this).data('locationshortname'));
        $(this).parent().fadeOut(300, function () {
          $(this).remove();
        });
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
    var that = this;
    $('#arbitrate-button').click(function () {
      that.onArbitrate();
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

   _setDismissSnackBarOnClickHandler: function() {
     $('#dismissSnackbar').click(function(){
       $('#snackbar-message').text('');
       $('.snackbar').hide();
     });
   },

  /**
   * Set the onClick() handler for the navigation drawer button (i.e. the
   * hamburger icon). Also sets up all the navigation drawer item onClick()
   * handlers.
   */
  _setNavDrawerOnClickHandlers: function() {
    var that = this;

    $('.nav-drawer-header').click(function() {
      $('#nav-drawer').css({
        'transform': 'translate(-256px, 0px)'
      });
    });

    $('.nav-drawer-item').each(function() {
      var data = $(this).data('item');

      $(this).click(function() {
        that.loadContent(data, StringUtils.capitalize(data), function() {
          that.refreshPreferences();
        });
      });
    });
  },

  /**
   * Open the navigation drawer using a transition animation.
   */
  openNavDrawer: function() {
    $('#nav-drawer').css({
      'transform': 'translate(0px, 0px)'
    });
  },

  /**
   * Close the navigation drawer using a transition animation.
   */
  closeNavDrawer: function() {
    $('#nav-drawer').css({
      'transform': 'translate(-256px, 0px)'
    });
  },

  /**
   * Load content into the main content pane.
   *
   * This asynchronously loads a file prefixed with an appropriate file id into
   * the main content pane, adjusts the title and back stack, and calls an
   * optional onComplete() handler when finished.
   *
   * @param aContentFileId The id of the content file to load. This must
   *        correspond to a file in the html/ subdirectory called
   *        <aContentFileId>.partial.html.
   * @param aTitle The title of the page to load. Will be presented in the app
   *        bar.
   * @param aOnComplete (optional) If included, this will be called when the
   *        load operation has completed.
   */
  loadContent: function(aContentFileName, aTitle, aOnComplete) {
    var that = this;

    // Set the text of the nav drawer header
    that.closeNavDrawer();

    $('main#content').load('html/' + aContentFileName + '.partial.html', null,
                           function() {
                             that._addToBackStack({
                               'id': aContentFileName,
                               'name': aTitle
                             });

                             if (!that._isBackStackEmpty()) {
                               that._showBackArrow();
                             } else {
                               that._showHamburgerIcon();
                             }

                             // Add the title to the app bar.
                             $('#pageTitle').text(aTitle);

                             if (aOnComplete) {
                               aOnComplete();
                             }
                           });
  },

  /**
   * Show the back arrow icon in place of the navigation drawer icon and adjust
   * the onClick() functionality for this icon so that it pops from the back
   * stack.
   */
  _showBackArrow: function() {
    var that = this;

    $('#hamburger').css({
      'background': 'no-repeat url("images/back.svg")'
    });

    that._bindEventHandlerForNavMenu(true);
  },

  /**
   * Show the hamburger (navigation drawer indicator) icon and adjust
   * the onClick() functionality for this icon so that it opens the navigation
   * drawer.
   */
  _showHamburgerIcon: function() {
    var that = this;

    $('#hamburger').css({
      'background': 'no-repeat url("images/hamburger.svg")'
    });

    that._bindEventHandlerForNavMenu(false);
  },

  /**
   * Clear current event handlers for the nav menu button in the upper right of
   * the app bar and re-add the appropriate onClick() handler.
   */
  _bindEventHandlerForNavMenu: function(aIsBack) {
    var that = this;
    $('#hamburger').unbind('click');

    if (aIsBack) {
      $('#hamburger').click(function() {
        that._popBackStack();
      });
    } else {
      $('#hamburger').click(function() {
        that.openNavDrawer();
      });
    }
  },

  /**
   * Add a new back stack entry to the back stack.
   *
   * A back stack entry consists of an object of the form:
   * {
   *   'id': <string>,
   *   'name': <string
   * }
   * where 'id' is a string indicating the id of the content to show, which must
   * be unique and be the prefix of one of the .partial.html files in the html/
   * subdirectory, and 'name' is the human-readable title of the content.
   *
   * @param aBackStackEntry The back stack entry to add to the back stack.
   */
  _addToBackStack: function(aBackStackEntry) {
    this.mBackStack.push(aBackStackEntry);
  },

  /**
   * Remove the last back stack entry from the back stack and return it.
   *
   * A back stack entry consists of an object of the form:
   * {
   *   'id': <string>,
   *   'name': <string
   * }
   * where 'id' is a string indicating the id of the content to show, which must
   * be unique and be the prefix of one of the .partial.html files in the html/
   * subdirectory, and 'name' is the human-readable title of the content.
   *
   * @return The back stack entry in the back stack that was last added.
   */
  _popBackStack: function() {
    // Remove the current entry from the back stack first
    this.mBackStack.pop();

    var lastEntry = this.mBackStack.pop();
    this.loadContent(lastEntry.id, lastEntry.name, null);
  },

  /**
   * Determine if the back stack is empty.
   *
   * The back stack is empty if it contains a single content node - that of the
   * 'main' or root content.
   *
   * @return True, if the back stack contains 1 item; false, otherwise.
   */
  _isBackStackEmpty: function() {
    return this._getBackStackSize() == 1;
  },

  /**
   * @return The number of items in the back stack.
   */
  _getBackStackSize: function() {
    return this.mBackStack.length;
  }
};
