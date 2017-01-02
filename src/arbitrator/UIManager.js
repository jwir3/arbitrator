import jQuery from 'jquery'
import $ from 'jquery'
import { Place } from './Place'
import { ArbitratorGoogleClient } from './ArbitratorGoogleClient'
import { ArbitratorConfig } from './ArbitratorConfig'
import { StringUtils } from './StringUtils'
import { PreferenceSingleton, TimeType } from './PreferenceStore'
import { Arbitrator } from './Arbitrator'
import { Strings } from './Strings'
import util from 'util'
import { LocationService } from './LocationService'
import { QuickCrypto } from './QuickCrypto'
import Lockr from 'lockr';

export var UIManager = function() {
}

UIManager.prototype = {
  mGoogleClient: null,
  mBackStack: new Array(),
  mVersion: '0.0.0',
  mLocationService: new LocationService(),

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

  setVersion: function(aVersion) {
    this.mVersion = aVersion;
  },

  getVersion: function() {
    return this.mVersion
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
   *
   * XXX_jwir3: It would be nice if we could somehow specify which refresh
   *            method should be performed, so we don't refresh all preferences
   *            after every screen load.
   */
  refreshPreferences: function() {
    var prefStore = PreferenceSingleton.instance;

    this._hidePreferencesBasedOnFeatureFlags();

    this.refreshTimePreferences();
    this.refreshAliasPreferences();
    this.refreshLocationPreferences();
    this.refreshProfilePreferences();

    this._setPreferenceOnClickHandlers();
  },

  /**
   * Refresh the data for the LeagueProfile view.
   */
  refreshProfilePreferences: function() {
    // We need all of the group data to populate the profile names.
    var prefStore = PreferenceSingleton.instance;
    var aliases = prefStore.getAllGroupAliasNamesAsSortedArray();

    for (var idx in aliases) {
      var name = aliases[idx];
      this._addLeagueProfileSubMenu(name);
    }
  },

  refreshGameClassificationLevelPreferences: function(aGroupName) {
    var self = this;
    var prefStore = PreferenceSingleton.instance;

    // Hook up the UI for adding a new game age preference.
    $('#addNewGameClassificationLevel').off();
    $('#addNewGameClassificationLevel').click(function() {
      self._createNewGameClassificationLevelSetting();
    });

    // Remove all children first.
    $('#leagueProfileContent').children().remove();

    // Load the existing preferences.
    self.loadPartialContent('partials/game-classification-preference.partial.html')
      .then((data) => {
        var prefStore = PreferenceSingleton.instance;
        var gameClassificationSettings = prefStore.getLeagueProfile(aGroupName);
        if (gameClassificationSettings) {
          var levels = gameClassificationSettings.getLevels();
          for (var gameClassificationIdx in levels) {
            var gameClassificationPref = levels[gameClassificationIdx];
            var settingUI = $(data);
            var dataSettingId = settingUI.data('settingId', gameClassificationPref.getId());
            var inputClassification = settingUI.find('#gameClassificationInputClassification');
            var inputLevel = settingUI.find('#gameClassificationInputLevel');
            var inputRegex = settingUI.find('#gameClassificationInputRegex');
            var removeButton = settingUI.find('#removeButton');
            var modifyButton = settingUI.find('#modifyButton');

            inputClassification.val(gameClassificationPref.getClassification());
            inputLevel.val(gameClassificationPref.getLevel());
            inputRegex.val(gameClassificationPref.getRegEx());

            inputClassification.attr('id', 'gameClassificationInputClassification-' + gameClassificationPref.getId());
            inputLevel.attr('id', 'gameClassificationInputLevel-' + gameClassificationPref.getId());
            inputRegex.attr('id', 'gameClassificationInputRegex-' + gameClassificationPref.getId());

            removeButton.attr('id', 'removeButton-' + gameClassificationPref.getId());
            removeButton.click(function() {
              var parentElement = $(this).parent();
              var id = parentElement.data('settingId');
              prefStore.removeGameClassificationLevelFromProfile(aGroupName, id);
              self.refreshGameClassificationLevelPreferences(aGroupName);
            });

            modifyButton.attr('id', 'modifyButton-' + gameClassificationPref.getId());
            modifyButton.click(function() {
              var parentElement = $(this).parent();
              var id = parentElement.data('settingId');
              var inputClassificationWithId = $('#gameClassificationInputClassification-' + id);
              var inputLevelWithId = $('#gameClassificationInputLevel-' + id);
              var inputRegexWithId = $('#gameClassificationInputRegex-' + id);

              prefStore.adjustGameClassificationLevel(aGroupName, id,
                                           inputClassificationWithId.val(),
                                           inputLevelWithId.val(),
                                           inputRegexWithId.val());

              self.showSnackbar(util.format(Strings.game_age_preference_updated,
                                            inputClassificationWithId.val(),
                                            inputLevelWithId.val()));
              self.refreshGameClassificationLevelPreferences(aGroupName);
            });
            $('#leagueProfileContent').append(settingUI);
          }
        }
      })
      .catch((error) => {
        console.log("Unable to load game age profile preference template");
      });
  },

  /**
   * Refresh the preference UI from local storage for all time preferences.
   */
  refreshTimePreferences: function() {
    var prefStore = PreferenceSingleton.instance;
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
    var prefStore = PreferenceSingleton.instance;
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
    $('#aliasInputs').html('');
    var prefStore = PreferenceSingleton.instance;
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
    var prefStore = PreferenceSingleton.instance;
    prefStore.addTimePreference(aTimePrefName, timePrefVal);
  },

  setArbiterAuthenticationFromUI: function() {
    var arbiterUsername = $('#arbiterUsername').val();
    var arbiterPassword = $('#arbiterPassword').val();
    var prefStore = PreferenceSingleton.instance;
    prefStore.setArbiterAuthentication(arbiterUsername, arbiterPassword);
  },

  /**
   * Add an alias UI element for a given group name and alias.
   *
   * @param aGroupName The name of the group (as specified in the input) for which
   *        an alias was created.
   * @param aGroupAlias The name of the alias to use for this group.
   */
  addAliasUIFor: function(aGroupName, aGroupAlias) {
    var self = this;
    self.loadPartialContent('partials/alias-preference.partial.html')
      .then((data) => {
        var dataElement = $(data);
        dataElement.find('.originalName')
                   .data('actualname', aGroupName)
                   .attr('value', aGroupName);
        dataElement.find('.aliasRemoveButton')
                   .data('actualname', aGroupName);

        // If the group name is the same as the alias name, just assume we don't
        // have an alias set.
        if (aGroupAlias != aGroupName) {
          dataElement.find('.aliasName').attr('value', aGroupAlias);
        }

        $('#aliasInputs').append(dataElement);
        self._setAliasPreferenceOnClickHandlers();
      })
      .catch((error) => {
        console.error("Unable to load 'partials/alias-preference.partial.html': "
                      + error);
      });
  },

  showSnackbar: function(aMessage) {
    $('#snackbar-message').text(aMessage);
    $('dialog.snackbar').show();

    setTimeout(function() {
      $('dialog.snackbar').hide();
    }, 4000);
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
      var prefStore = PreferenceSingleton.instance;
      prefStore.addGroupAlias(aGroupName, aAliasName);
      // this.acknowledgePreference(aGroupName);
      this.showSnackbar("Alias '" + aAliasName + "' set");
  },

  /**
   * Set a location preference after doing some basic validation of the data.
   *
   * Create a new {Place} and submit this to the preference system to be stored.
   *
   * @param {string} aLocationPrefKey  The preference system key for the
   *        preference. If it exists, the preference system will replace the
   *        key with the newly created {Place}.
   * @param {string} aLocationPrefName The human-readable name of the place to
   *        be created.
   */
  setLocationPreference: function(aLocationPrefKey, aLocationPrefName) {
    var self = this;
    var addressElement = $('#locationAddressPref-' + aLocationPrefKey);
    var address = addressElement.val();
    var subLocationElement = $('#locationSubLocationPref-' + aLocationPrefKey);
    var subLocationName = subLocationElement.val();

    // If either the address or sublocation name is empty, and the other is a
    // non-default placeholder, use the placeholder in lieu of the value.
    if (subLocationName && !addressElement.val()
        && !self._isLocationAddressPlaceholderDefault(addressElement)) {
      address = addressElement.attr('placeholder');
    }

    if (address && !subLocationElement.val()
        && !self._isLocationSublocationPlaceholderDefault(subLocationElement)) {
      subLocationName = subLocationElement.attr('placeholder');
    }

    var prefName = '';
    var prefStore = PreferenceSingleton.instance;
    prefStore.addLocationPreference(new Place(aLocationPrefKey, aLocationPrefName, address, subLocationName));

    var addressConfirmed = util.format(Strings.address_for_set,
                                       aLocationPrefName);
    this.showSnackbar(addressConfirmed);
  },

  deleteLocationPreference: function(aLocationKey) {
    var prefStore = PreferenceSingleton.instance;
    prefStore.removeLocationPreference(aLocationKey);
  },

  deleteAliasPreference: function(aGroupName) {
    var prefStore = PreferenceSingleton.instance;
    prefStore.removeGroupAlias(aGroupName);
  },

  addLocationPreference: function(aPlace) {
    var self = this;
    $.get('partials/location-preference.partial.html', function(data) {
      var dataElement = $(data);
      var addressTextInputId = 'locationAddressPref-' + aPlace.getShortName();
      var subLocationTextInputId = 'locationSubLocationPref-' + aPlace.getShortName();

      var addressPlaceholderText = util.format(Strings.enter_address_for,
                                               aPlace.getName());
      if (aPlace.getAddress()) {
        addressPlaceholderText = aPlace.getAddress();
      }

      var subLocationPlaceholderText = '';
      if (aPlace.hasSubLocation()) {
        subLocationPlaceholderText = aPlace.getSubLocationName();
      }

      dataElement.find('label').attr('for', addressTextInputId).text(aPlace.getName());
      dataElement.find('.locationTextInput')
                 .attr('id', addressTextInputId)
                 .attr('placeholder', addressPlaceholderText);
      dataElement.find('.locationTextInput.small').attr('id', subLocationTextInputId)
                 .attr('placeholder', subLocationPlaceholderText);
      dataElement.find('.locationRemoveButton')
                 .data('locationshortname', aPlace.getShortName());
      dataElement.find('.locationSetButton')
                 .data('locationshortname', aPlace.getShortName())
                 .data('locationname', aPlace.getName());

      $('#locationInputs').append(dataElement);
      var addressElement = document.getElementById('locationAddressPref-' + aPlace.getShortName())

      var Typeahead = require('typeahead');

      // Since this method is run every time preferences are refreshed, and in
      // order to generalize the loadContent() method a bit we refresh all
      // preferences on every content load, this should only be called if there
      // actually _is_ a location preference input element in the DOM.
      if (addressElement) {
        // Enable typeahead input on the address input element.
        var locService = new LocationService();
        Typeahead(addressElement, {
          source: function (query, result) {
            locService.getPredictionsForQuery(query, result);
          }
        });

        self._setLocationPreferenceOnClickHandlers();
      }
    });
  },

  // logout: function() {
  //   var prefStore = PreferenceSingleton.instance;
  //   prefStore.removeUserId();
  //   location.reload();
  // },

  _hidePreferencesBasedOnFeatureFlags: function() {
    if (!ArbitratorConfig.hasOwnProperty('feature_arbiter_sports_login')) {
      console.warn("Could not find feature flag feature_arbiter_sports_login. Assuming it's set to false.");
    }

    if (ArbitratorConfig.feature_arbiter_sports_login) {
      $('#feature_arbiter_sports_login').show();
    } else {
      $('#feature_arbiter_sports_login').hide();
    }
  },

  /**
   * Set all onClick() handlers for preference UI elements.
   */
  _setPreferenceOnClickHandlers: function() {
    this._setTimePreferenceOnClickHandlers();
    this._setArbiterConnectionPreferenceOnClickHandlers();
    this._setAliasPreferenceOnClickHandlers();
    this._setLocationPreferenceOnClickHandlers();
  },

  /**
   * Set whether the "Setup Connection" button is visible on the settings page.
   *
   * @param isVisible [boolean] If true, the "Setup Connection" button will be
   *        visible, and the refreshing indicator will be hidden; if false, the
   *        opposite will be true.
   */
  _setConnectionButtonVisible(isVisible) {
    if (isVisible) {
      $('#setupArbiterConnection').show();
      $('#connectionIndicator').hide();
    } else {
      $('#setupArbiterConnection').hide();
      $('#connectionIndicator').show();
    }
  },

  _setArbiterConnectionPreferenceOnClickHandlers: function() {
    var self = this;
    $('#setArbiterAuth').click(function() {
      self.setArbiterAuthenticationFromUI();
    });

    $('#setupArbiterConnection').click(() => {
      self._setConnectionButtonVisible(false);
      $('#connection-successful').hide();
      $('#connection-failed').hide();

      const prefStore = PreferenceSingleton.instance;
      const { BrowserWindow, app } = require('electron').remote;
      var ipcRenderer = require('electron').ipcRenderer;

      var aspAuth = Lockr.get('ASPXAUTH_ARBITER');
      ipcRenderer.send('arbiter-request-create-window', aspAuth);
      ipcRenderer.on('arbiter-window-closed', (event, message) => {
        self._setConnectionButtonVisible(true);
      });

      ipcRenderer.on('arbiter-authenticated', (event, aspAuth) => {
        Lockr.set("ASPXAUTH_ARBITER", aspAuth);

        // This next part closes the window and returns a positive
        // authentication status.
        ipcRenderer.send('arbiter-request-destroy-window', true);
      });

      ipcRenderer.on('arbiter-connection-check-finished', (event, wasSuccessful) => {
        if (wasSuccessful) {
          $('#connection-successful').show();
          $('#connection-failed').hide();
        } else {
          $('#connection-successful').hide();
          $('#connection-failed').show();
        }
      });

      // ipcRenderer.on('arbiter-document-received', (event, dom) => {
      //   console.log(dom);
      // });
    });
  },

  /**
   * Set the onClick() handlers for time preferences.
   */
  _setTimePreferenceOnClickHandlers: function() {
    var self = this;
    $('#setPriorToStart').click(function() {
      var minutes = $('#timePref-priorToStart').val();
      self.setTimePreferenceFromUI('priorToStart');
      var priorToStartAcknowledge = util.format(Strings.calendar_events_will_start,
                                                minutes);
      self.showSnackbar(priorToStartAcknowledge);
    });

    $('#setGameLength').click(function() {
      var length = $('#timePref-gameLength').val();
      self.setTimePreferenceFromUI('gameLength');
      var gameLengthAcknowledge = util.format(Strings.calendar_events_length,
                                              length);
      self.showSnackbar(gameLengthAcknowledge);
    });

    $('#setConsecutiveGames').click(function() {
      var consecutiveThresh = $('#timePref-consecutiveGames').val();
      self.setTimePreferenceFromUI('consecutiveGames');
      var consecutiveAcknowledge = util.format(Strings.consecutive_games_acknowledgement,
                                               consecutiveThresh);
      self.showSnackbar(consecutiveAcknowledge);
    });
  },

  /**
   * Set the onClick() handlers for alias/group preferences.
   */
  _setAliasPreferenceOnClickHandlers: function() {
    var self = this;
    var prefStore = PreferenceSingleton.instance;

    $('button.setAlias').each(function() {
      $(this).off('click');
      $(this).click(function() {
        var actualName = $(this).parent().find('.originalName').data('actualname');
        var aliasName = $(this).parent().find('.aliasName').val();
        self.addAliasToPrefStore(actualName, aliasName);
      });
    });

    $('.aliasRemoveButton').each(function() {
      $(this).off('click');
      $(this).click(function() {
        self.deleteAliasPreference($(this).data('actualname'));
        $(this).parent().fadeOut(300, function () {
          $(this).remove();
        });
      });
    });

    $('#aliasAddButton').off('click');
    $('#aliasAddButton').click(function() {
      var actualName = $('#aliasAddName').text();
      var aliasName = $('#aliasAddAlias').text();

      self.addAliasToPrefStore(actualName, aliasName);

      $('#aliasAddName').text('');
      $('#aliasAddAlias').text('');

      self.refreshAliasPreferences();
    });
  },

  _setLocationPreferenceOnClickHandlers: function() {
    var self = this;
    $('.locationSetButton').each(function() {
      $(this).click(function() {
        var locationShortName = $(this).data('locationshortname');
        var locationName = $(this).data('locationname');

        self.setLocationPreference(locationShortName, locationName);
      });
    });

    $('.locationRemoveButton').each(function() {
      $(this).click(function() {
        self.deleteLocationPreference($(this).data('locationshortname'));
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
    var self = this;
    // First, remote all handlers that were previousl associated with this
    // button.
    $('#arbitrate-button').off();
    $('#arbitrate-button').click(function () {
      self.onArbitrate();
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
    var self = this;

    $('.nav-drawer-header').click(function() {
      $('#nav-drawer').css({
        'transform': 'translate(-256px, 0px)'
      });
    });

    $('.nav-drawer-item').each(function() {
      var rawData = $(this).data('item');
      var unspacedData = rawData.replace(/\s/, '-');

      $(this).click(function() {
        self.loadContent(unspacedData, StringUtils.capitalize(rawData), function() {
          self.refreshPreferences();
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
   * Load partial content using an AJAX request.
   *
   * @param  {string} aPartialContentPath The path to the file that should be
   *                                      loaded as the partial content.
   *
   * @return {Promise} A Promise that can be used to access the partial content
   *                   view structure (e.g. the partial DOM), once it's loaded.
   */
  loadPartialContent: function(aPartialContentPath) {
    return $.get(aPartialContentPath);
  },

  /**
   * Load content into the main content pane.
   *
   * This asynchronously loads a file prefixed with an appropriate file id into
   * the main content pane, adjusts the title and back stack, and calls an
   * optional onComplete() handler when finished.
   *
   * @param aContentFileId The id of the content file to load. This must
   *        correspond to a file in the partials/ subdirectory called
   *        <aContentFileId>.partial.html.
   * @param aTitle The title of the page to load. Will be presented in the app
   *        bar.
   * @param aOnComplete (optional) If included, this will be called when the
   *        load operation has completed.
   */
  loadContent: function(aContentFileName, aTitle, aOnComplete) {
    var self = this;

    // Set the text of the nav drawer header
    self.closeNavDrawer();

    $('main#content').load('partials/' + aContentFileName + '.partial.html', null,
                           function() {
                             self._addToBackStack({
                               'id': aContentFileName,
                               'name': aTitle
                             });

                             if (!self._isBackStackEmpty()) {
                               self._showBackArrow();
                             } else {
                               self._showHamburgerIcon();
                             }

                             // Add the title to the app bar.
                             $('#pageTitle').text(aTitle);

                             // Add the version number to the app bar
                             $('#versionNumber').text('v' + self.getVersion());

                             if (aContentFileName == 'main') {
                               self.refreshGoogleClient(function(aGoogleClient) {
                                 self.populateCalendarList(aGoogleClient);
                                 self.populateUserId(aGoogleClient);
                                 self._setArbitrateOnClickHandler();
                               });
                             }

                             if (aOnComplete) {
                               aOnComplete();
                             }
                           });
  },

  /**
   * Refresh the ArbitratorGoogleClient object held internally.
   *
   * If necessary, this will create a new ArbitratorGoogleClient object.
   *
   * @param aOnComplete A function to execute after the ArbitratorGoogleClient
   *        is initialized. If the ArbitratorGoogleClient is already set up, it
   *        will execute immediately; otherwise, it will execute once the
   *        ArbitratorGoogleClient is completely initialized. This function
   *        should take a single argument: the ArbitratorGoogleClient instance
   *        (in the event you want to work with it in the callback).
   */
  refreshGoogleClient: function(aOnComplete) {
    if (this.mGoogleClient == null) {
      this.mGoogleClient = new ArbitratorGoogleClient();
    }

    this.mGoogleClient.getClient().then((client) => {
      aOnComplete(this.mGoogleClient);
    });
  },

  /**
   * Populate the list of calendars in the main user interface.
   *
   * @param  {[ArbitratorGoogleClient]} aGoogleClient The client with which the
   *                                    api calls should be run with.
   */
  populateCalendarList: function(aGoogleClient) {
    var calendarSelector = $('#calendarList');
    var noCalendarSelectedOption = $('<option id="noCalendarSelectedOption">' + Strings.select_calendar + '</option>');
    calendarSelector.append(noCalendarSelectedOption);

    aGoogleClient.getCalendarList()
      .then((items) => {
        var selectEle = $('#calendarList');
        for (var calendarIdx in items) {
            var calendarItem = items[calendarIdx];
            var listItem = $('<option></option>');
            listItem.attr('id', calendarItem.id);
            listItem.text(calendarItem.summary);
            selectEle.append(listItem);
        }
        selectEle.css('display', 'block');
      });
  },

/**
 * Populate the Google+ user id of the user in the preference store.
 *
 * @param  {[ArbitratorGoogleClient]} aGoogleClient The client with which the
 *                                    api calls should be run with.
 */
  populateUserId: function(aGoogleClient) {
    aGoogleClient.getUserId().then((id) => {
      var prefStore = PreferenceSingleton.instance;
      prefStore.setUserId(id);
    });
  },

  /**
   * Clear the main text input to the Arbitrator tool.
   */
  clearArbitratorInput: () => {
    $('#schedule').val('');
  },

  /**
   * Show the back arrow icon in place of the navigation drawer icon and adjust
   * the onClick() functionality for this icon so that it pops from the back
   * stack.
   */
  _showBackArrow: function() {
    var self = this;

    $('#hamburger').css({
      'background': 'no-repeat url("images/back.svg")'
    });

    self._bindEventHandlerForNavMenu(true);
  },

  /**
   * Show the hamburger (navigation drawer indicator) icon and adjust
   * the onClick() functionality for this icon so that it opens the navigation
   * drawer.
   */
  _showHamburgerIcon: function() {
    var self = this;

    $('#hamburger').css({
      'background': 'no-repeat url("images/hamburger.svg")'
    });

    self._bindEventHandlerForNavMenu(false);
  },

  /**
   * Clear current event handlers for the nav menu button in the upper right of
   * the app bar and re-add the appropriate onClick() handler.
   */
  _bindEventHandlerForNavMenu: function(aIsBack) {
    var self = this;
    $('#hamburger').unbind('click');

    if (aIsBack) {
      $('#hamburger').click(function() {
        self._popBackStack();
      });
    } else {
      $('#hamburger').click(function() {
        self.openNavDrawer();
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
   * be unique and be the prefix of one of the .partial.html files in the partials/
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
   * be unique and be the prefix of one of the .partial.html files in the partials/
   * subdirectory, and 'name' is the human-readable title of the content.
   *
   * @return The back stack entry in the back stack that was last added.
   */
  _popBackStack: function() {
    var self = this;

    // Remove the current entry from the back stack first
    this.mBackStack.pop();

    var lastEntry = this.mBackStack.pop();

    this.loadContent(lastEntry.id, lastEntry.name, function() {
      self.refreshPreferences();
    });
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
  },

  _isLocationAddressPlaceholderDefault: function(aJQueryObject) {
    var defaultPlaceholderPrefix = Strings.enter_address_for.slice(0, 17);
    return aJQueryObject.attr('placeholder').startsWith(defaultPlaceholderPrefix);
  },

  _isLocationSublocationPlaceholderDefault: function(aJQueryObject) {
    return aJQueryObject.attr('placeholder') == '';
  },

  _createNewGameClassificationLevelSetting: function() {
    var self = this;
    var prefStore = PreferenceSingleton.instance;

    // Grab the values
    var regex = $('#gameClassificationInputRegex').val();
    var age = $('#gameClassificationInputClassification').val();
    var level = $('#gameClassificationInputLevel').val();

    // Push to the preference store
    var profileName = $('#leagueProfileContent').data('profilename');
    prefStore.addGameClassificationLevelSetting(profileName, age, level, regex);

    // Refresh the prefs.
    self.refreshGameClassificationLevelPreferences(profileName);

    $('#gameClassificationInputClassification').val('');
    $('#gameClassificationInputLevel').val('');
    $('#gameClassificationInputRegex').val('');
  },

  _addLeagueProfileSubMenu: function(aName) {
    var self = this;
    self.loadPartialContent('partials/league-profile-preference.partial.html')
      .then((partialContent) => {
        var partialContentDOM = $(partialContent);
        partialContentDOM.find('.league-profile-label').append(aName);
        partialContentDOM.click(function() {
          self.loadContent('league-profile', aName + " Game Classification Profile", function() {
            $('#leagueProfileContent').data('profilename', aName);
            self.refreshGameClassificationLevelPreferences(aName);
          });
        });
        $('#levelsContent').append(partialContentDOM);
      })
      .catch((error) => {
        console.error("Unable to load 'partials/league-profile-preference.partial.html': "
                      + error);
      });
  }
};
