/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./temp/specs_entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config/env_test.json":
/*!******************************!*\
  !*** ./config/env_test.json ***!
  \******************************/
/*! exports provided: name, description, default */
/***/ (function(module) {

module.exports = {"name":"test","description":"Add here any environment specific stuff you like."};

/***/ }),

/***/ "./config/strings.json":
/*!*****************************!*\
  !*** ./config/strings.json ***!
  \*****************************/
/*! exports provided: games_added_message, referee, linesman, officiate, scrimmage, tournament, rink, select_calendar, address_for_set, enter_address_for, calendar_events_will_start, calendar_events_length, consecutive_games_acknowledgement, game_age_preference_updated, game_classification, game_level, game_regex, arbitrator_identifier_description, default */
/***/ (function(module) {

module.exports = {"games_added_message":"Game(s) added to calendar","referee":"Referee","linesman":"Linesman","officiate":"Officiate","scrimmage":"Scrimmage","tournament":"Tournament","rink":"Rink","select_calendar":"Select Calendar","address_for_set":"Address for %s set","enter_address_for":"Enter address for %s","calendar_events_will_start":"Calendar events will start %d minutes prior to the game start","calendar_events_length":"Calendar events will be set to %d minutes in length","consecutive_games_acknowledgement":"Any games within %d hours of each other at the same location will be considered consecutive","game_age_preference_updated":"Game age preference '%s %s' updated","game_classification":"Classification","game_level":"Level","game_regex":"Regular Expression","arbitrator_identifier_description":"ArbitratorGameInfoId"};

/***/ }),

/***/ "./src/arbitrator/Arbitrator.js":
/*!**************************************!*\
  !*** ./src/arbitrator/Arbitrator.js ***!
  \**************************************/
/*! exports provided: Arbitrator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Arbitrator", function() { return Arbitrator; });
/* harmony import */ var _Game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game.js */ "./src/arbitrator/Game.js");
/* harmony import */ var _UIManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UIManager */ "./src/arbitrator/UIManager.js");
/* harmony import */ var _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PreferenceStore */ "./src/arbitrator/PreferenceStore.js");
/* harmony import */ var _ArbitratorGoogleClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ArbitratorGoogleClient */ "./src/arbitrator/ArbitratorGoogleClient.js");
/* harmony import */ var _Strings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Strings */ "./src/arbitrator/Strings.js");





/**
 * An object for combining two callbacks for what to do when searching for Google
 * Calendar events.
 *
 * @param aMatchFunction The function to call when a matching event is found in
 *        the Google Calendar. Syntax for calling this method:
 *        onMatchFound(aGame, aCalendarEvent)
 *        where aGame represents the Game object which was searched for, and
 *        aCalendarEvent represents the Google Calendar Event object representing
 *        the event in the calendar.
 * @param aNoMatchFunction The function to call when the completed search did not
 *        find a match for a given Game object. Syntax for calling this method:
 *        onNoMatchFound(aGame)
 *        where aGame represents the Game object which was searched for.
 */

var EventSearchObserver = function (aMatchFunction, aNoMatchFunction) {
  this.onMatchFound = aMatchFunction;
  this.onNoMatchFound = aNoMatchFunction;
};

var Arbitrator = function (aString) {
  this.mBaseString = aString;
  this.mGames = {};
  this.numGames = 0;
  this.parseFromText();
  this.mUiManager = new _UIManager__WEBPACK_IMPORTED_MODULE_1__["UIManager"]();
  this.mGoogleClient = new _ArbitratorGoogleClient__WEBPACK_IMPORTED_MODULE_3__["ArbitratorGoogleClient"]();
};
Arbitrator.prototype = {
  parseFromText: function () {
    this.mBaseString = this.mBaseString.replace(/Accepted\ on\ [0-9]+\/[0-9]+\/([0-9]{4})/g, '');
    var cols = this.mBaseString.split(/[\t\n]+/);
    this.mTable = new Array();
    var row = new Array();
    var columnPointer = 0;
    var removedLastCol = false;

    for (var col in cols) {
      // col is our GLOBAL column pointer - the index of the current column in
      // the whole set of all columns. columnPointer is the relative colum
      // pointer - the index of the column in the current row.
      var trimmedCol = cols[col].trim();

      if (trimmedCol.length != 0) {
        var oldLength = row.length;
        var newLength = row.push(trimmedCol);
      } else if (columnPointer == 1) {
        row.push("NONE");
      } // Special date handling, in the event that we actually have a newline in
      // between where the date is and where the time is (this happens occasionally)


      if (columnPointer == 4 && (row[columnPointer].endsWith("PM") || row[columnPointer].endsWith("AM"))) {
        row[columnPointer - 1] = row[columnPointer - 1] + " " + row[columnPointer];
        row.pop();
        columnPointer = columnPointer - 1;
      }

      columnPointer = columnPointer + 1;

      if (columnPointer == 9) {
        this.mTable.push(row);
        var gm = new _Game_js__WEBPACK_IMPORTED_MODULE_0__["Game"](row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
        row = new Array();
        this.mGames[gm.getId()] = gm;
        this.numGames++;
        columnPointer = 0;
      }
    }

    this.findConsecutiveGames();
  },
  getNumGames: function () {
    return this.numGames;
  },
  getGameById: function (aId) {
    if (this.mGames[aId]) {
      return this.mGames[aId];
    }

    return null;
  },
  getRows: function () {
    return this.mTable;
  },
  getColumns: function (aRow) {
    return this.mTable[aRow];
  },
  getDescription: function (aRow) {
    // Game description is column 5
    return this.mTable[aRow][5];
  },

  /**
   * @returns 0, if the row is a referee assignment; 1, if the row is a linesman
   *          assignment; -1 otherwise.
   */
  getRole: function (aGameId) {
    return this.mGames[aGameId].getRole();
  },
  //   /**
  //    * Notify the user that a game was added to his/her calendar.
  //    */
  //   // notifyGameAdded: function(aGame) {
  //   //   this.mUiManager.setMessage('Game #' + aGame.getId() + ' was added to Google Calendar.');
  //   //   this.mUiManager.refreshPreferences();
  //   // },
  //
  //   /**
  //    * Notify the user that a game was adjusted on his/her calendar.
  //    */
  //   // notifyGameAdjusted: function(aGame) {
  //   //   this.mUiManager.setMessage('Game #' + aGame.getId() + ' was adjusted in Google Calendar.');
  //   // },

  /**
   * Submit games in Arbitrator to Google Calendar.
   *
   * If any games in this object correspond to games already listed in Google
   * Calendar, then these games will be updated with new date/time information.
   * If a game does not already exist in Google Calendar, then it will be added
   * using the submitGameToCalendar() function.
   *
   * @param aCalendarId The ID of the calendar where the games should be placed.
   */
  adjustGamesOrSubmitToCalendar: function (aCalendarId) {
    // Save this pointer so it can be used in the callback.
    var self = this;
    var numGames = Object.keys(this.mGames).length;
    var gamesProcessed = 0;
    var callback = new EventSearchObserver(function (aGame, aCalendarEvent) {
      self.mGoogleClient.adjustGameInCalendar(aCalendarId, aCalendarEvent, aGame).then(() => {
        gamesProcessed++;

        if (gamesProcessed == numGames) {
          self.mUiManager.showSnackbar(_Strings__WEBPACK_IMPORTED_MODULE_4__["Strings"].games_added_message);
        }
      });
    }, function (aGame) {
      console.log("Saw no match");
    });

    for (var key in this.mGames) {
      if (this.mGames.hasOwnProperty(key)) {
        var game = this.mGames[key]; // self.mGoogleClient.findGameInCalendar(aCalendarId, game)
        // .then((foundEventId) => {
        // if (!foundEventId) {
        // var googleClient = new ArbitratorGoogleClient();

        self.mGoogleClient.submitGameToCalendar(aCalendarId, game).then(() => {
          gamesProcessed++;

          if (gamesProcessed == numGames) {
            self.mUiManager.showSnackbar(_Strings__WEBPACK_IMPORTED_MODULE_4__["Strings"].games_added_message);
            self.mUiManager.clearArbitratorInput();
          }
        }); // } else {
        // console.log("Game found with event id: " + foundEventId);
        // }
        // });
      }
    }
  },

  /**
   * Retrieve all games in this Arbitrator object.
   *
   * @return An array of all Game objects known about by this Arbitrator
   * instance.
   */
  getAllGames: function () {
    return this.mGames;
  },

  /**
   * Search through all games to find those that are consecutive.
   *
   * Note that this does not currently search through calendar history. That is,
   * only games that are entered together in the same Arbitrator object are
   * under consideration for being linked in a consecutive manner.
   */
  findConsecutiveGames: function () {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["PreferenceSingleton"].instance;
    var gameLengthMins = prefStore.getTimePreference(_PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["TimePreferenceKeys"].LENGTH_OF_GAME, 60);
    var prevGame;

    for (var index in this.mGames) {
      var curGame = this.mGames[index];

      if (prevGame && curGame.isWithinConsecutiveTimeRangeOf(prevGame) && curGame.getSite().getName() == prevGame.getSite().getName()) {
        curGame.setConsecutiveGame(true);
      }

      prevGame = curGame;
    }
  }
};

/***/ }),

/***/ "./src/arbitrator/ArbitratorConfig.js":
/*!********************************************!*\
  !*** ./src/arbitrator/ArbitratorConfig.js ***!
  \********************************************/
/*! exports provided: ArbitratorConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArbitratorConfig", function() { return ArbitratorConfig; });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! env */ "./config/env_test.json");
var env__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! env */ "./config/env_test.json", 1);


var ArbitratorConfig = {
  /**
   * Set this value to the Google Web Application Client ID you generated when
   * creating a new OAuth2 permission in your Google Developer Console.
   */
  // NOTE: These values should all be injected, based on the appropriate
  //       environment, during the build.
  'google_client_id': env__WEBPACK_IMPORTED_MODULE_1__.google_client_id,
  'google_client_secret': env__WEBPACK_IMPORTED_MODULE_1__.google_client_secret,
  'google_api_key': env__WEBPACK_IMPORTED_MODULE_1__.google_api_key,
  // Feature flags below this line.
  'feature_arbiter_sports_login': false
};

/***/ }),

/***/ "./src/arbitrator/ArbitratorGoogleClient.js":
/*!**************************************************!*\
  !*** ./src/arbitrator/ArbitratorGoogleClient.js ***!
  \**************************************************/
/*! exports provided: ArbitratorGoogleClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArbitratorGoogleClient", function() { return ArbitratorGoogleClient; });
/* harmony import */ var _ArbitratorConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArbitratorConfig */ "./src/arbitrator/ArbitratorConfig.js");
/* harmony import */ var googleapis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! googleapis */ "googleapis");
/* harmony import */ var googleapis__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(googleapis__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers_window__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/window */ "./src/helpers/window.js");
/* harmony import */ var _PreferenceStore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PreferenceStore */ "./src/arbitrator/PreferenceStore.js");
/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Game */ "./src/arbitrator/Game.js");
/* harmony import */ var _Strings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Strings */ "./src/arbitrator/Strings.js");





 // Specify default options to be used with all requests.
// google.options({ proxy: 'http://localhost:5555' });

/**
 * Create a new instance of an ArbitratorGoogleClient object for use with Arbitrator.
 *
 * @param aOptionalCallback (Optional) A callback to be called when the
 *        ArbitratorGoogleClient has finished its initialization.
 */

var ArbitratorGoogleClient = function () {};
ArbitratorGoogleClient.prototype = {
  client: null,
  getClient: function () {
    var that = this;
    return new Promise((resolve, reject) => {
      var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_3__["PreferenceSingleton"].instance;
      var OAuth2 = googleapis__WEBPACK_IMPORTED_MODULE_1__["auth"].OAuth2;
      that.client = new OAuth2(_ArbitratorConfig__WEBPACK_IMPORTED_MODULE_0__["ArbitratorConfig"].google_client_id, _ArbitratorConfig__WEBPACK_IMPORTED_MODULE_0__["ArbitratorConfig"].google_client_secret, 'urn:ietf:wg:oauth:2.0:oob' // Instruct google to return the auth code via the title
      );
      var tokens = prefStore.getAuthTokens();

      if (tokens) {
        that.client.setCredentials(tokens);
        resolve(that.client);
      } else {
        var scopes = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile'];
        var url = that.client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: 'offline',
          scope: scopes
        });
        var window = Object(_helpers_window__WEBPACK_IMPORTED_MODULE_2__["default"])('googleAuth', {
          width: 400,
          height: 650
        });
        window.loadURL(url);
        window.on('page-title-updated', () => {
          setImmediate(() => {
            const title = window.getTitle();

            if (title.startsWith('Denied')) {
              reject(new Error(title.split(/[ =]/)[2]));
              window.removeAllListeners('closed');
              window.close();
            } else if (title.startsWith('Success')) {
              var code = title.split(/[ =]/)[2];
              that.client.getToken(code, function (err, tokens) {
                // Now tokens contains an access_token and an optional refresh_token. Save them.
                if (!err) {
                  that.client.setCredentials(tokens);
                  var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_3__["PreferenceSingleton"].instance;
                  prefStore.setAuthTokens(tokens);
                  resolve(that.client);
                  window.removeAllListeners('closed');
                  window.close();
                }
              });
            }
          });
        });
      }
    });
  },
  getCalendarList: function () {
    var that = this;
    return new Promise((resolve, reject) => {
      var cal = googleapis__WEBPACK_IMPORTED_MODULE_1__["calendar"]({
        version: 'v3',
        auth: that.client
      });
      cal.calendarList.list(null, null, function (err, result) {
        if (err) {
          reject(err);
        }

        resolve(result.items);
      });
    });
  },
  getUserId: function () {
    var that = this;
    return new Promise((resolve, reject) => {
      var plus = googleapis__WEBPACK_IMPORTED_MODULE_1__["plus"]({
        version: 'v1',
        auth: that.client
      });
      plus.people.get({
        'userId': 'me'
      }, function (err, result) {
        if (err) {
          reject(err);
        }

        resolve(result.id);
      });
    });
  },

  /**
   * Adjust a game that is already in Google Calendar to have new data.
   *
   * This is accomplished by removing the current event in Google Calendar and
   * adding a new event with the corresponding data. No checking is done to
   * determine if these two events represent the same game.
   *
   * @param aCalendarId The id of the calendar which should have the event.
   * @param aEvent The event data structure given from Google that should be
   *        deleted.
   * @param aGame The game data structure that has the new data.
   */
  adjustGameInCalendar: function (aCalendarId, aEvent, aGame) {
    var that = this;
    return new Promise((resolve, reject) => {
      that.getToken(() => {
        var cal = googleapis__WEBPACK_IMPORTED_MODULE_1__["calendar"]({
          version: 'v3',
          auth: that.client
        }); // First, delete the old event.

        cal.events.delete({
          'calendarId': aCalendarId,
          'eventId': aEvent.id
        }, function (err, result) {
          if (err) {
            reject(err);
          } else {
            // Now, submit the new event.
            return submitGameToCalendar(aCalendarId, aGame);
          }
        });
      });
    });
  },

  /**
   * Submits a game to Google Calendar using the javascript REST api.
   *
   * @param aCalendarId The id of the calendar which should have the event.
   * @param aGame The Game to submit to the calendar.
   */
  submitGameToCalendar: function (aCalendarId, aGame) {
    var that = this;
    return new Promise((resolve, reject) => {
      that.getClient().then(client => {
        var eventToInsert = aGame.getEventJSON();
        var cal = googleapis__WEBPACK_IMPORTED_MODULE_1__["calendar"]({
          version: 'v3',
          auth: client
        });
        cal.events.insert({
          'calendarId': aCalendarId,
          'resource': eventToInsert
        }, {}, function (err, result) {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        });
      });
    });
  },

  /**
   * Find a game within a given calendar.
   *
   * @param aCalendarId The google calendar id for the calendar which should be
   *        searched for events.
   * @param aGame The game that should be searched for within the calendar.
   * @param aCallback An object with two functions: foundMatchingEvent() and
   *        noMatchingEventFound(), representing logic to perform when an event
   *        was found or not found, respectively.
   */
  findGameInCalendar: function (aCalendarId, aGame) {
    return new Promise((resolve, reject) => {
      var that = this;
      that.getClient().then(oAuthClient => {
        var cal = googleapis__WEBPACK_IMPORTED_MODULE_1__["calendar"]({
          version: 'v3',
          auth: oAuthClient
        });
        var searchString = aGame.getEncipheredGameInfoString();
        var req = cal.events.list({
          'calendarId': aCalendarId
        }, {}, function (err, result) {
          if (err) {
            reject(err);
            return;
          }

          var results = result.items;
          var foundEvent = false;

          for (var i = 0; i < results.length; i++) {
            var calEvent = results[i];

            if (calEvent.description && calEvent.description.indexOf(searchString) > 0) {
              resolve(calEvent);
              return;
            }
          }

          if (!foundEvent) {
            resolve();
          }
        });
      }).catch(err => {
        reject(err);
      });
    });
  }
};

/***/ }),

/***/ "./src/arbitrator/DeviceInfo.js":
/*!**************************************!*\
  !*** ./src/arbitrator/DeviceInfo.js ***!
  \**************************************/
/*! exports provided: DeviceInfoSingleton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeviceInfoSingleton", function() { return DeviceInfoSingleton; });
/* harmony import */ var macaddress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! macaddress */ "macaddress");
/* harmony import */ var macaddress__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(macaddress__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! os */ "os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_2__);



const DEVICE_SINGLETON_KEY = Symbol("DeviceInfo");

var DeviceInfo = function () {};

DeviceInfo.prototype = {
  mMachineKey: null,
  mMacAddress: null,
  getEncryptedDeviceKey: function () {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self.mMachineKey != null) {
        resolve(self.mMachineKey);
      }

      self.getMachineIdentifier().then(machineId => {
        self.mMachineKey = crypto__WEBPACK_IMPORTED_MODULE_2___default.a.pbkdf2Sync(machineId, os__WEBPACK_IMPORTED_MODULE_1___default.a.userInfo().username, 1, 32, 'sha512').toString('hex');
        resolve(self.mMachineKey);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getMachineIdentifier: function () {
    var self = this;
    return new Promise((resolve, reject) => {
      var osName = self.getOSName();
      var osVersion = self.getOSVersion();
      var cpuModel = self.getCPUModel();
      self.getMacAddress().then(aMacAddress => {
        resolve(osName + osVersion + cpuModel + aMacAddress);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getOSVersion: function () {
    return os__WEBPACK_IMPORTED_MODULE_1___default.a.release();
  },
  getOSName: function () {
    return os__WEBPACK_IMPORTED_MODULE_1___default.a.platform();
  },
  getCPUModel: function () {
    return os__WEBPACK_IMPORTED_MODULE_1___default.a.cpus()[0].model;
  },
  getMacAddress: function () {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self.mMacAddress) {
        resolve(self.mMacAddress);
      }

      macaddress__WEBPACK_IMPORTED_MODULE_0___default.a.one(function (aError, aMac) {
        if (aError) {
          reject(new Error(aError));
        }

        self.mMacAddress = aMac;
        resolve(self.mMacAddress);
      });
    });
  }
};
var DeviceInfoSingleton = {};
Object.defineProperty(DeviceInfoSingleton, "instance", {
  get: function () {
    if (!global[DEVICE_SINGLETON_KEY]) {
      global[DEVICE_SINGLETON_KEY] = new DeviceInfo();
    }

    return global[DEVICE_SINGLETON_KEY];
  }
});
Object.freeze(DeviceInfoSingleton);

/***/ }),

/***/ "./src/arbitrator/Game.js":
/*!********************************!*\
  !*** ./src/arbitrator/Game.js ***!
  \********************************/
/*! exports provided: Role, Game */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Role", function() { return Role; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Game", function() { return Game; });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Place__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Place */ "./src/arbitrator/Place.js");
/* harmony import */ var _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PreferenceStore */ "./src/arbitrator/PreferenceStore.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var Strings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! Strings */ "./config/strings.json");
var Strings__WEBPACK_IMPORTED_MODULE_4___namespace = /*#__PURE__*/__webpack_require__.t(/*! Strings */ "./config/strings.json", 1);





/**
 * Enumeration for Roles. Currently, an official (for hockey) can be one of the
 * following:
 *
 *  - A Referee
 *  - A Linesman
 *  - An unknown role
 *
 * No other roles are supported at this time. In the future, it would be nice to
 * support other roles, but it's unclear how long this polyfill for lack of
 * Google calendar support in AS will last.
 */

var Role = Object.freeze({
  REFEREE: 0,
  LINESMAN: 1,
  UNKNOWN: -1
});
var Game = function (aId, aGroup, aRole, aTimestamp, aSportLevel, aSite, aHomeTeam, aAwayTeam, aFees) {
  var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["PreferenceSingleton"].instance;
  this.mId = aId;
  this.mGroupId = aGroup;
  this.mGroup = prefStore.getAliasForGroupId(this.mGroupId);
  this.setRole(aRole);
  this.mTimestamp = aTimestamp;
  this.mSportLevel = aSportLevel;
  this.mSite = this.getPlaceForSite(aSite);
  this.mHomeTeam = aHomeTeam;
  this.mAwayTeam = aAwayTeam;
  this.mFees = aFees;
  this.mIsConsecutiveGame = false;
}; // Static methods on Game class

/**
 * Retrieve a data structure containing the game id and group id, given an
 * encrypted form of them.
 *
 * @param  {String} aEncrypted Encrypted form of game information.
 *
 * @return {String} The unencrypted version of the identifying game information.
 */

Game.getGameInfoFromCipher = function (aEncrypted) {
  const decipher = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createDecipher('aes-256-ofb', 'gameHash');
  var decrypted = decipher.update(aEncrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  var gameInfoArray = decrypted.split('-##-');
  return {
    'groupId': gameInfoArray[0],
    'gameId': gameInfoArray[1]
  };
}; // Game class member methods


Game.prototype = {
  getId: function () {
    return this.mId;
  },
  getGroupId: function () {
    return this.mGroupId;
  },
  getGroup: function () {
    return this.mGroup;
  },
  getSportLevel: function () {
    return this.mSportLevel;
  },
  getSite: function () {
    return this.mSite;
  },
  getHomeTeam: function () {
    return this.mHomeTeam;
  },
  getAwayTeam: function () {
    return this.mAwayTeam;
  },
  getFees: function () {
    return this.mFees;
  },
  getTimestampAsString: function () {
    // Retrieves the arbiter-printed string, which currently has the format:
    // MM/DD/YYYY h:MM A
    var components = this.mTimestamp.split(" ");
    return components[0] + " " + components[2] + " " + components[3];
  },

  /**
   * Retrieve the moment for which this game starts.
   *
   * @return {Moment} A Moment.js moment for which this game is set to start,
   *                  based on the data from ArbiterSports.
   */
  getTimestamp: function () {
    return moment__WEBPACK_IMPORTED_MODULE_3__(this.getTimestampAsString(), "MM/DD/YYYY h:mm a");
  },
  getTime12Hr: function () {
    return this.getTimestamp().format("h:mma");
  },
  getISOStartDate: function () {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["PreferenceSingleton"].instance;
    var startDate = this.getTimestamp();
    var priorToStart = prefStore.getTimePreference(_PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["TimePreferenceKeys"].PRIOR_TO_START, 30);

    if (this.isConsecutiveGame()) {
      priorToStart = 0;
    }

    return startDate.subtract(priorToStart, 'minutes').toISOString();
  },
  getISOEndDate: function () {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["PreferenceSingleton"].instance;
    var endDate = this.getTimestamp(); // Default to 1 hour if no time preference is specified.

    var gameLengthMins = prefStore.getTimePreference(_PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["TimePreferenceKeys"].LENGTH_OF_GAME, 60);
    return endDate.add(gameLengthMins, 'minutes').toISOString();
  },

  /**
   * Determines if this game is a consecutive game (a game where the preceding
   * game is at the same site and ended within two hours of the start of this
   * game).
   *
   * @return true, if this game is a consecutive game; false, otherwise.
   */
  isConsecutiveGame: function () {
    return this.mIsConsecutiveGame;
  },

  /**
   * Set whether or not this game is a consecutive game (a game where the
   * preceding game is at the same site and ended within two hours of the start
   * of this game).
   *
   * @param aIsConsecutive Whether or not this is a consecutive game
   */
  setConsecutiveGame: function (aIsConsecutive) {
    this.mIsConsecutiveGame = aIsConsecutive;
  },

  /**
   * Determines if this game is within the time range (within the same day and
   * within the consecutive game threshold) necessary to be considered for a
   * possible consecutive game with another game.
   *
   * @param aGame A Game for which this game should be determined to follow by
   *        less than the threshold for consecutive games.
   *
   * @return true, if this Game is within the time range necessary to make it a
   *         potential consecutive game; false, otherwise.
   */
  isWithinConsecutiveTimeRangeOf: function (aGame) {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["PreferenceSingleton"].instance;
    var consecutiveGameThreshold = prefStore.getTimePreference(_PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["TimePreferenceKeys"].CONSECUTIVE_GAME_THRESHOLD, 2);
    var aOtherTimestamp = aGame.getTimestamp();
    var timeStamp = this.getTimestamp();
    return aOtherTimestamp.date() == timeStamp.date() && aOtherTimestamp.year() == timeStamp.year() && aOtherTimestamp.month() == timeStamp.month() && aOtherTimestamp.hours() + consecutiveGameThreshold >= timeStamp.hours();
  },
  setRole: function (aRoleString) {
    // Role is column 3, and can be either "Referee" or "Linesman".
    if (aRoleString.search(/referee/i) != -1) {
      this.mRole = Role.REFEREE;
    } else if (aRoleString.search(/linesman/i) != -1) {
      this.mRole = Role.LINESMAN;
    } else {
      this.mRole = Role.UNKNOWN;
    }
  },
  isTeamValid: function (aTeamName) {
    switch (aTeamName) {
      case 'TBD':
        return false;

      case 'TBA':
        return false;

      default:
        return true;
    }
  },
  getLevel: function () {
    var levelString = this.getSportLevel();
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["PreferenceSingleton"].instance; // Load all game level preferences for the given group.

    var gameProfile = prefStore.getLeagueProfile(this.getGroup());

    if (!gameProfile) {
      console.warn(`No game age profile was found for group '${this.getGroup()}'. Unable to resolve game age level '${levelString}'`);
      return 'UNKNOWN';
    } // Find one where the regex matches.


    var matchingGameClassificationLevel = gameProfile.findGameClassificationLevelMatching(levelString);

    if (!matchingGameClassificationLevel) {
      console.warn(`Unable to find game age/level matching ${levelString} in profile for '${this.getGroup()}'`);
      return 'UNKNOWN';
    }

    return matchingGameClassificationLevel.getClassification() + " " + matchingGameClassificationLevel.getLevel();
  },
  areTeamsValid: function () {
    return this.isTeamValid(this.mHomeTeam) && this.isTeamValid(this.mAwayTeam);
  },
  getSummaryString: function () {
    var summaryString = "";

    if (this.getGroup() != "NONE") {
      summaryString = summaryString + "[" + this.getGroup() + "] ";
    }

    var role = this.getRole();

    if (role == Role.REFEREE) {
      summaryString = summaryString + Strings__WEBPACK_IMPORTED_MODULE_4__["referee"] + " ";
    } else if (role == Role.LINESMAN) {
      summaryString = summaryString + Strings__WEBPACK_IMPORTED_MODULE_4__["linesman"] + " ";
    } else {
      summaryString = summaryString + Strings__WEBPACK_IMPORTED_MODULE_4__["officiate"] + " ";
    }

    if (this.isScrimmage()) {
      summaryString = summaryString + Strings__WEBPACK_IMPORTED_MODULE_4__["scrimmage"] + " ";
    }

    if (this.areTeamsValid()) {
      summaryString = summaryString + this.mHomeTeam + " v " + this.mAwayTeam + " ";
    }

    var level = this.getLevel();

    if (level != 'UNKNOWN') {
      summaryString = summaryString + "(" + level + (this.isTournament() ? " " + Strings__WEBPACK_IMPORTED_MODULE_4__["tournament"] : "") + ")";
    }

    return summaryString.trim();
  },
  getRole: function () {
    return this.mRole;
  },
  getEventJSON: function () {
    var siteData = this.getSite().getAddress() ? this.getSite().getAddress() : this.getSite().getName();
    var subLocationString = this.getSite().hasSubLocation() ? "\n\n" + Strings__WEBPACK_IMPORTED_MODULE_4__["rink"] + " " + this.getSite().getSubLocationName() : "";
    return {
      "end": {
        "dateTime": this.getISOEndDate()
      },
      "start": {
        "dateTime": this.getISOStartDate()
      },
      "location": siteData,
      "description": "Game starts at " + String(this.getTime12Hr()) + subLocationString + "\n\n" + this.getEncipheredGameInfoString(),
      "summary": this.getSummaryString()
    };
  },
  getEncipheredGameInfoString: function () {
    var arbitratorIdString = Strings__WEBPACK_IMPORTED_MODULE_4__["arbitrator_identifier_description"];
    return "{" + arbitratorIdString + ": " + String(this.getGameInfoCipher()) + "}";
  },
  isScrimmage: function () {
    return this.getSportLevel().search(/scrimmage/i) != -1;
  },
  isTournament: function () {
    return this.getSportLevel().search(/tournament/i) != -1;
  },

  /**
   * Retrieve an identification string for this game. Essentially, this is
   * just a concatenation of the game id, the group, teams playing, and level.
   *
   * @return A string that is an identifier for this game. This identifier should
   *         not change, even if the game dates/times change.
   */
  getIdentificationString: function () {
    var idString = String(this.getGroupId() + "-##-" + this.getId());
    return idString.replace(/\s+/gm, "");
  },

  /**
   * Retrieve an encrypted version of the unique identifying information of this
   * game. This serves to identify the game if the date/time changes.
   *
   * @return {String} An encrypted version of the game identification string.
   */
  getGameInfoCipher: function () {
    var self = this;
    const cipher = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createCipher('aes-256-ofb', 'gameHash');
    var encrypted = cipher.update(self.getIdentificationString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },

  /**
   * Retrieve a Place object for some existing site string.
   *
   * @param aSiteName The textual name of the site, as passed in from ArbiterSports.
   *
   * @returns A Place object with name equivalent to aSiteName, but with an address
   *          if one was found in the preference store.
   */
  getPlaceForSite: function (aSiteName) {
    // Convert the site name to a key
    var placeKey = aSiteName.replace(/\s/g, '');
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_2__["PreferenceSingleton"].instance;

    if (prefStore.hasLocationPreference(placeKey)) {
      return prefStore.getLocationPreference(placeKey);
    }

    var place = new _Place__WEBPACK_IMPORTED_MODULE_1__["Place"](placeKey, aSiteName, undefined, "");
    prefStore.addLocationPreference(place);
    return place;
  }
};

/***/ }),

/***/ "./src/arbitrator/LeagueProfile.js":
/*!*****************************************!*\
  !*** ./src/arbitrator/LeagueProfile.js ***!
  \*****************************************/
/*! exports provided: LeagueProfile, GameClassificationLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LeagueProfile", function() { return LeagueProfile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameClassificationLevel", function() { return GameClassificationLevel; });
/**
 * Create a new {LeagueProfile} object.
 *
 * @param {string} aProfileIdentifier The identifier to use for the new profile.
 *        It should be unique.
 */
var LeagueProfile = function (aProfileIdentifier) {
  this.profileId = aProfileIdentifier;
  this.classificationLevels = [];
};
/**
 * A profile containing {GameClassificationLevel}s. Typically, the profile will
 * be associated with a group, but it can conceivably be associated with any
 * string.
 */

LeagueProfile.prototype = {
  profileId: null,
  classificationLevels: [],

  /**
   * Add a new {GameClassificationLevel} to this {LeagueProfile}.
   *
   * @param {GameClassificationLevel} aGameClassificationLevel The new {GameClassificationLevel} to add.
   */
  addGameClassificationLevel: function (aGameClassificationLevel) {
    this.classificationLevels.push(aGameClassificationLevel);

    this._regenerateGameClassificationLevelIds();
  },

  /**
   * Remove an existing {GameClassificationLevel} from this {LeagueProfile}.
   *
   * @param  {GameClassificationLevel} aGameClassificationLevel The {GameClassificationLevel} object to remove from this {LeagueProfile}.
   */
  removeGameClassificationLevel: function (aGameClassificationLevel) {
    for (var idx in this.classificationLevels) {
      if (this.classificationLevels[idx].equals(aGameClassificationLevel)) {
        this.classificationLevels.splice(idx, 1);

        this._regenerateGameClassificationLevelIds();
      }
    }
  },
  getProfileId: function () {
    return this.profileId;
  },
  getNumLevels: function () {
    return this.classificationLevels.length;
  },

  /**
   * Retrieve the {GameClassificationLevel} objects held in this
   * {LeagueProfile}, sorted first by classification, then by level.
   *
   * @return {Array} An array of {GameClassificationLevel}s, sorted in
   *                 alphabetical order.
   */
  getLevels: function () {
    return this.classificationLevels.sort(function (a, b) {
      if (a.getClassification() == b.getClassification()) {
        if (a.getLevel() < b.getLevel()) {
          return -1;
        } else if (a.getLevel() == b.getLevel()) {
          return 0;
        } else {
          return 1;
        }
      } else if (a.getClassification() < b.getClassification()) {
        return -1;
      } else {
        return 1;
      }
    });
  },

  /**
   * Remove a {GameClassificationLevel} by its id.
   *
   * @param {string} aId An identifier string to match against.
   */
  removeGameClassificationLevelById: function (aId) {
    for (var idx in this.classificationLevels) {
      if (this.classificationLevels[idx].getId() == aId) {
        this.classificationLevels.splice(idx, 1);

        this._regenerateGameClassificationLevelIds();

        return;
      }
    }
  },

  /**
   * Retrieve a {GameClassificationLevel} by its id.
   *
   * @param {string} aId An identifier string to match against.
   *
   * @return A {GameClassificationLevel}, if one exists that has id == aId; null,
   *         otherwise.
   */
  getGameClassificationLevelById: function (aId) {
    for (var i = 0; i < this.classificationLevels.length; i++) {
      if (this.classificationLevels[i].getId() == aId) {
        return this.classificationLevels[i];
      }
    }

    return null;
  },

  /**
   * Find a {GameClassificationLevel} matching the given search string, if one exists.
   *
   * @param {string} aSearchString The string to compare against regular
   *        expressions in each of the {GameClassificationLevel}s contained in this
   *        {LeagueProfile}.
   * @return {Object} The first {GameClassificationLevel} whose regular expression matches
   *         the search string, if one exists; null, otherwise.
   */
  findGameClassificationLevelMatching: function (aSearchString) {
    var firstFound = null;

    for (var idx in this.classificationLevels) {
      if (this.classificationLevels[idx].matches(aSearchString)) {
        if (!firstFound) {
          firstFound = this.classificationLevels[idx];
        } else {
          console.warn(`There are multiple game classifications that match the search string '${aSearchString}'. You may have overlapping regular expressions.`);
        }
      }
    }

    return firstFound;
  },

  /**
   * Regenerate all ids for {GameClassificationLevel} settings within this
   * {LeagueProfile}.
   */
  _regenerateGameClassificationLevelIds: function () {
    for (var idx in this.classificationLevels) {
      this.classificationLevels[idx].setId(idx);
    }
  }
  /**
   * Create a new GameClassificationLevel.
   *
   * @param {String} classification    The classification of this new
   *                                   {GameClassificationLevel}. This can be an
   *                                   age group (e.g. "Bantam" or "Squirt"), or
   *                                   a gender classification (e.g. "Boys").
   * @param {String} level             The level of play for the new object. This
   *                                   can be a recreational level (e.g. A, B, C),
   *                                   or some other level descriptor (e.g.
   *                                   Varsity).
   * @param {String} regularExpression The regular expression which will be used
   *                                   to match sport levels of input strings
   *                                   with the new object.
   */

};
var GameClassificationLevel = function (classification, level, regularExpression) {
  this.classification = classification;
  this.level = level;
  this.regularExpression = regularExpression;
};
/**
 * A data structure representing a {Game} object's classification and ability
 * level.
 *
 * Each object contains a regular expression to search for, along with
 * a classification bracket (can be numeric or a name, such as 'Bantam'), and a
 * level (e.g. 'A', 'B', Varsity, etc...).
 *
 * This can then be compared to inputs given in a particular game to determine
 * if it matches.
 *
 * @type {GameClassificationLevel}
 */

GameClassificationLevel.prototype = {
  classification: null,
  level: null,
  regularExpression: null,
  id: null,
  setId: function (aId) {
    this.id = aId;
  },
  getId: function () {
    return this.id;
  },
  setClassification: function (aclassification) {
    this.classification = aclassification;
  },
  getClassification: function () {
    return this.classification;
  },
  setLevel: function (aLevel) {
    this.level = aLevel;
  },
  getLevel: function () {
    return this.level;
  },
  setRegEx: function (aRegEx) {
    this.regularExpression = aRegEx;
  },
  getRegEx: function () {
    return this.regularExpression;
  },
  equals: function (aOther) {
    return this.classification == aOther.classification && this.level == aOther.level && this.regularExpression == aOther.regularExpression;
  },

  /**
   * Determine if this {GameClassificationLevel} matches an input string.
   *
   * @param  {String} aSportLevelInput An input string to match against.
   *
   * @return {boolean}                  true, if this object's regular
   *                                    expression matches the given input
   *                                    string; false, otherwise.
   */
  matches: function (aSportLevelInput) {
    var regularExpression = new RegExp(this.regularExpression);
    return regularExpression.test(aSportLevelInput);
  }
};

/***/ }),

/***/ "./src/arbitrator/LocationService.js":
/*!*******************************************!*\
  !*** ./src/arbitrator/LocationService.js ***!
  \*******************************************/
/*! exports provided: LocationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocationService", function() { return LocationService; });
/* harmony import */ var node_rest_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-rest-client */ "node-rest-client");
/* harmony import */ var node_rest_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_rest_client__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ArbitratorConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArbitratorConfig */ "./src/arbitrator/ArbitratorConfig.js");


var LocationService = function () {};
LocationService.prototype = {
  mCurrentLatitude: 0.0,
  mCurrentLongitude: 0.0,
  mGoogleMapsClient: __webpack_require__(/*! @google/maps */ "@google/maps").createClient({
    key: _ArbitratorConfig__WEBPACK_IMPORTED_MODULE_1__["ArbitratorConfig"].google_api_key
  }),
  mDistanceCircle: null,

  /**
   * A replacement for navigator.geolocation.getCurrentPosition().
   *
   * It's still unclear why navigator.geolocation.getCurrentPosition doesn't
   * work within electron, but it's possible that it has something to do with:
   * https://github.com/electron/electron/issues/1376
   */
  _getCurrentPosition: function (callback) {
    var client = new node_rest_client__WEBPACK_IMPORTED_MODULE_0__["Client"]();
    client.get('https://maps.googleapis.com/maps/api/browserlocation/json?browser=chromium&sensor=true', function (data) {
      if (data.location) {
        var position = {
          coords: {
            latitude: data.location.lat,
            longitude: data.location.lng
          }
        };
        callback(position);
      }
    });
  },

  /**
   * Use the Google Maps API to retrieve Google place predictions for a given
   * string query.
   *
   * @param query [string] The search term for the prediction query
   * @param callback [function(Array)] The function to call when results are
   *        available. These results are sent as an array to the callback.
   */
  getPredictionsForQuery: function (query, callback) {
    var self = this;

    self._getCurrentPosition(function (aPosition) {
      // Success
      self.mCurrentLatitude = aPosition.coords.latitude;
      self.mCurrentLongitude = aPosition.coords.longitude;
      self.mGoogleMapsClient.placesQueryAutoComplete({
        input: query,
        language: 'en',
        location: [self.mCurrentLatitude, self.mCurrentLongitude],
        radius: 5000
      }, function (error, response) {
        var results = [];
        var predictions = response.json.predictions;

        for (var i = 0; i < predictions.length; i++) {
          var nextPrediction = predictions[i];

          if (nextPrediction.types) {
            // We only want establishments and geocode types of places.
            if (nextPrediction.types.includes('establishment') || nextPrediction.types.includes('geocode')) {
              results.push(nextPrediction.description);
            }
          }
        }

        callback(results);
      });
    });
  }
};

/***/ }),

/***/ "./src/arbitrator/Place.js":
/*!*********************************!*\
  !*** ./src/arbitrator/Place.js ***!
  \*********************************/
/*! exports provided: Place */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Place", function() { return Place; });
/**
 * A Place consists of a name, a shorter name (the alias used within Arbiter to
 * identify the site), an address, and a sub-location name (possibly blank). The
 * address may be undefined if no address was specified for this Place.
 */
var Place = function (aShortName, aName, aAddress, aSubLocationName) {
  this.mShortName = aShortName;
  this.mName = aName;
  this.mAddress = aAddress;
  this.mSubLocationName = aSubLocationName;
};
Place.prototype = {
  getShortName: function () {
    return this.mShortName;
  },
  getName: function () {
    return this.mName;
  },
  getAddress: function () {
    return this.mAddress;
  },
  getSubLocationName: function () {
    return this.mSubLocationName;
  },
  hasSubLocation: function () {
    return this.getSubLocationName() != "";
  }
};

/***/ }),

/***/ "./src/arbitrator/PreferenceStore.js":
/*!*******************************************!*\
  !*** ./src/arbitrator/PreferenceStore.js ***!
  \*******************************************/
/*! exports provided: UserPreferenceKeys, TimePreferenceKeys, PreferenceSingleton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserPreferenceKeys", function() { return UserPreferenceKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimePreferenceKeys", function() { return TimePreferenceKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PreferenceSingleton", function() { return PreferenceSingleton; });
/* harmony import */ var _Place__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Place */ "./src/arbitrator/Place.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var env__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! env */ "./config/env_test.json");
var env__WEBPACK_IMPORTED_MODULE_4___namespace = /*#__PURE__*/__webpack_require__.t(/*! env */ "./config/env_test.json", 1);
/* harmony import */ var _LeagueProfile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LeagueProfile */ "./src/arbitrator/LeagueProfile.js");






const PREFERENCE_STORE_KEY = Symbol("PreferenceStore");
/**
 * An object connected to local storage for persistent storage of setting
 * data.
 *
 * Preference objects are broken into the following sub-objects:
 *  |-- groupAliases: Contains a set of key-value pairs matching ArbiterSports
 *  |                 group identifiers (key) to human-readable aliases to be
 *  |                 used in Google calendar (value).
 *  |-- time:         Contains three possible key-value pairs to control time
 *  |  |              settings.
 *  |  |-- priorToStart:     How many minutes prior to the start of a game Google
 *  |  |                     calendar events should be set to start at. Allows for
 *  |  |                     preparation time prior to games.
 *  |  |-- gameLength:       How many minutes games should occupy on the schedule
 *  |  |                     (i.e. the duration of calendar events).
 *  |  |-- consecutiveGames: The threshold (in hours) for determining whether two
 *  |                        games are consecutive, assuming they take place at
 *  |                        the same location.
 *  |-- locations:    Contains a set of key-value pairs where each key is an
 *  |                 identifer (from ArbiterSports) for a location, and each
 *  |                 value is the serialization of a {Place} object
 *  |                 representing that location in Arbitrator.
 *  |-- user:           Contains three possible key-value pairs to control
 *  |  |                user-specific settings:
 *  |  |-- id:           The value of this preference is the unique identifier of
 *  |  |                 the user, as obtained from Google.
 *  |  |-- googleAuth:   The value of this preference is an object with key-value
 *  |  |                 pairs that hold the authentication information for the
 *  |  |                 Google OAuth2 client.
 *  |  |-- lastCalendar: The value of this preference is the identifier of the
 *  |                    last calendar the user selected.
 *  |-- leagueProfiles: Contains an array of {LeagueProfile} objects.
 */

var PreferenceStore = function () {
  if (env__WEBPACK_IMPORTED_MODULE_4__.name == 'test') {
    this.shouldStore = false;
  }

  this._retrievePreferences();
};

var UserPreferenceKeys = {
  /**
   * Key for accessing Google user id data within the PreferenceStore.
   */
  USER_ID: 'userId',

  /**
   * Key for accessing Google OAuth2 data within the PreferenceStore.
   */
  GOOGLE_AUTH_DATA: 'googleAuth',

  /**
   * Key for accessing the last calendar id used from within the
   * PreferenceStore.
   */
  LAST_CALENDAR_ID: 'lastCalendar'
};
var TimePreferenceKeys = {
  /**
   * Flag for indicating the time type is prior to the game start.
   */
  PRIOR_TO_START: 'priorToStart',

  /**
   * Flag for indicating the time type is after the game start until the game
   * ends (i.e. the length of the game).
   */
  LENGTH_OF_GAME: 'gameLength',

  /**
   * Flag for indicating how long (in hours) between games should be considered
   * "consecutive" games. Any game at the same location within this number of
   * hours of a previous game on the same day will be considered "consecutive".
   */
  CONSECUTIVE_GAME_THRESHOLD: 'consecutiveGames'
};
PreferenceStore.prototype = {
  shouldStore: true,

  /**
   * Add an alias for a group ID so that it can be reported as a human-readable
   * name.
   *
   * @param aGroupId The id of the group to alias
   * @param aGroupAlias The alias to replace the group id with.
   */
  addGroupAlias: function (aGroupId, aGroupAlias) {
    if (!this.groupAliases) {
      this.groupAliases = {};
    }

    this._verifyExtensibility("groupAliases");

    this.groupAliases[aGroupId] = aGroupAlias;

    this._putPreferences();
  },

  /**
   * Add a new {LeagueProfile} to the preference store.
   *
   * @param {LeagueProfile} aLeagueProfile The profile to add to the
   *        preference store.
   */
  addLeagueProfile: function (aLeagueProfile) {
    if (!this.leagueProfiles) {
      this.leagueProfiles = [];
    }

    this.leagueProfiles.push(aLeagueProfile);

    this._putPreferences();
  },

  /**
   * Set an existing {LeagueProfile} to a new value.
   *
   * This will search, by profileId, for an existing {LeagueProfile} within
   * the preference store. If one is found, it will be removed and replaced with
   * the given parameter. If one is not found, then the given parameter will be
   * added to the preference store as if addLeagueProfile() was called.
   *
   * @param {LeagueProfile} aLeagueProfile The new profile to place into the
   *        preference store.
   */
  setLeagueProfile: function (aLeagueProfile) {
    for (var idx in this.leagueProfiles) {
      var nextProfile = this.leagueProfiles[idx];

      if (nextProfile.getProfileId() == aLeagueProfile.getProfileId()) {
        this.leagueProfiles.splice(idx, 1);
        break;
      }
    }

    this.addLeagueProfile(aLeagueProfile);
  },

  /**
   * Add a {GameClassificationLevelSetting} to a {LeagueProfile} and store it in the
   * preference store.
   *
   * @param {string} aProfileName The profileId of the {LeagueProfile} to add
   *                              the new setting to.
   * @param {string} aClassification         The age descriptor of the new
   *                              {GameClassificationLevelSetting}.
   * @param {string} aLevel       The level descriptor of the new
   *                              {GameClassificationLevelSetting}.
   * @param {string} aRegex       The regular expression defining the new
   *                              {GameClassificationLevelSetting}.
   */
  addGameClassificationLevelSetting: function (aProfileName, aClassification, aLevel, aRegex) {
    var self = this;
    var setting = new _LeagueProfile__WEBPACK_IMPORTED_MODULE_5__["GameClassificationLevel"](aClassification, aLevel, aRegex);
    var leagueProfile = self.getLeagueProfile(aProfileName);

    if (!leagueProfile) {
      leagueProfile = new _LeagueProfile__WEBPACK_IMPORTED_MODULE_5__["LeagueProfile"](aProfileName);
    }

    leagueProfile.addGameClassificationLevel(setting);
    self.setLeagueProfile(leagueProfile);
  },

  /**
   * Add a time preference to the preference store.
   *
   * @param aType The type to add. Must be one of TimePreferenceKeys available options.
   * @param aTimePeriod The time value to add to the preference store. If not
   *        >= 0, then will be set to 0.
   */
  addTimePreference: function (aType, aTimePeriod) {
    if (!this.time) {
      this.time = {};
    }

    if (aTimePeriod < 0) {
      console.log("Unable to set a time preference value < 0. Resetting time to 0.");
      aTimePeriod = 0;
    }

    var priorStart = this.time[TimePreferenceKeys.PRIOR_TO_START];
    var gameLength = this.time[TimePreferenceKeys.LENGTH_OF_GAME];
    var consecThreshold = this.time[TimePreferenceKeys.CONSECUTIVE_GAME_THRESHOLD];

    switch (aType) {
      case TimePreferenceKeys.PRIOR_TO_START:
        priorStart = aTimePeriod;
        break;

      case TimePreferenceKeys.LENGTH_OF_GAME:
        gameLength = aTimePeriod;
        break;

      case TimePreferenceKeys.CONSECUTIVE_GAME_THRESHOLD:
        consecThreshold = aTimePeriod;
        break;

      default:
        throw "Unable to determine type for '" + aType + "'";
    }

    this.time = {
      [TimePreferenceKeys.PRIOR_TO_START]: priorStart,
      [TimePreferenceKeys.LENGTH_OF_GAME]: gameLength,
      [TimePreferenceKeys.CONSECUTIVE_GAME_THRESHOLD]: consecThreshold
    };

    this._putPreferences();
  },
  addLocationPreference: function (aPlace) {
    if (!this.locations) {
      this.locations = {};
    }

    this._verifyExtensibility("locations");

    this.locations[aPlace.getShortName()] = aPlace;

    this._putPreferences();
  },

  /**
   * Retrieve the value of a single time preference.
   *
   * @param aTimePreferenceKeys The time of time preference to retrieve. Must be one of the
   *        types specified in TimePreferenceKeys.
   * @param aDefault The default time (in minutes) to specify if one has not been
   *        added to the preference store.
   *
   * @return A numeric value indicating the number of minutes specified for the
   *         given time preference.
   */
  getTimePreference: function (aTimePreferenceKeys, aDefault) {
    if (this.time && this.time[aTimePreferenceKeys]) {
      return parseInt(this.time[aTimePreferenceKeys], 10);
    }

    return aDefault;
  },

  /**
   * Retrieve all {LeagueProfile}s in the {PreferenceStore}.
   *
   * @return {Array} An array of {LeagueProfile} objects corresponding to all
   *                 the {LeagueProfile}s that exist in this {PreferenceStore}.
   */
  getAllLeagueProfiles: function () {
    if (!this.leagueProfiles) {
      this.leagueProfiles = [];
    }

    return this.leagueProfiles;
  },

  /**
   * Retrieve a specific {LeagueProfile} by its profile id.
   *
   * @param  {String} aProfileId A string identifier to search for.
   *
   * @return {LeagueProfile}     The {LeagueProfile} with id == aProfileId, if
   *                             it exists; null, otherwise.
   */
  getLeagueProfile: function (aProfileId) {
    var leagueProfiles = this.getAllLeagueProfiles();

    for (var idx in leagueProfiles) {
      let nextProfile = leagueProfiles[idx];

      if (nextProfile.getProfileId() == aProfileId) {
        return nextProfile;
      }
    }

    return null;
  },
  getLocationPreference: function (aLocationKey) {
    if (this.locations && this.locations[aLocationKey]) {
      var genericLoc = this.locations[aLocationKey];
      return new _Place__WEBPACK_IMPORTED_MODULE_0__["Place"](genericLoc.mShortName, genericLoc.mName, genericLoc.mAddress, genericLoc.mSubLocationName);
    }

    return aLocationKey;
  },

  /**
   * Retrieve all preferences related to time currently in the preference store.
   *
   * @return An object with members corresponding to time preferences as defined
   *         in TimePreferenceKeys, if they exist in the local storage; an empty object,
   *         otherwise.
   */
  getAllTimePreferences: function () {
    if (this.time) {
      return Object.freeze(this.time);
    }

    return new Object();
  },
  getAllLocationPreferences: function () {
    if (this.locations) {
      return Object.freeze(this.locations);
    }

    return new Object();
  },

  /**
   * Retrieve all preferences related to group aliases currently in the
   * preference store.
   *
   * @return An object with members corresponding to group alias preferences if
   *         any exist in the local storage; an empty object, otherwise.
   */
  getAllGroupAliases: function () {
    if (this.groupAliases) {
      return Object.freeze(this.groupAliases);
    }

    return new Object();
  },

  /**
   * Retrieve all of the group alias names in an array sorted in alphabetical
   * order.
   *
   * @return {array} An array of {string} values, where each entry is an alias
   *         for a group entered into the group alias preferences (i.e. the
   *         resolved value, not the original value). This is array is returned
   *         sorted in alphabetical order.
   */
  getAllGroupAliasNamesAsSortedArray: function () {
    var sortedArray = [];
    var groupAliases = this.getAllGroupAliases();

    for (var prop in groupAliases) {
      if (groupAliases.hasOwnProperty(prop)) {
        sortedArray.push(groupAliases[prop]);
      }
    }

    return sortedArray.sort();
  },

  /**
   * Retrieve an alias for a group, based on an ID submitted.
   */
  getAliasForGroupId: function (aGroupId) {
    if (this.groupAliases) {
      var actualName = this.groupAliases[aGroupId];

      if (actualName) {
        return actualName;
      }
    } // Once it's been seen, we should add it to the preference store.


    this.addGroupAlias(aGroupId, aGroupId);
    return aGroupId;
  },

  /**
   * Determine if there are aliased groups in local storage.
   *
   * @return true, if there is at least one group id with an alias;
   *         false, otherwise
   */
  hasAliasedGroups: function () {
    if (this.groupAliases) {
      for (var prop in this.groupAliases) {
        if (this.groupAliases.hasOwnProperty(prop)) {
          return true;
        }
      }
    }

    return false;
  },

  /**
   * Determine if there are time preferences saved in local storage.
   *
   * @return true, if there is at least one time preference saved to local storage;
   *         false, otherwise
   */
  hasTimePreferences: function () {
    if (this.time) {
      for (var prop in this.time) {
        if (this.time.hasOwnProperty(prop)) {
          return true;
        }
      }
    }

    return false;
  },
  hasLocationPreference: function (aPreferenceKey) {
    if (this.locations) {
      if (this.locations.hasOwnProperty(aPreferenceKey)) {
        return true;
      }
    }

    return false;
  },

  /**
   * Remove the instance of a single time preference from the preference store.
   *
   * @param aTimePreferenceKeys The type of time preference to remove. Must be one of the
   *        values specified in TimePreferenceKeys.
   */
  removeTimePreference: function (aTimePreferenceKeys) {
    if (this.time) {
      delete this.time[aTimePreferenceKeys];
    }

    this._putPreferences();
  },
  removeLocationPreference: function (aLocationKey) {
    this._verifyExtensibility("locations");

    if (this.locations) {
      delete this.locations[aLocationKey];
    }

    this._putPreferences();
  },

  /**
   * Remove a previously created alias for a group ID.
   *
   * @param The group id for which the previously-created alias should be
   *         removed.
   */
  removeGroupAlias: function (aGroupId) {
    this._verifyExtensibility("groupAliases");

    if (this.groupAliases) {
      delete this.groupAliases[aGroupId];
    }

    this._putPreferences();
  },
  setLastCalendarId: function (aLastCalendarId) {
    if (!this.user) {
      this.user = {};
    }

    this.user[UserPreferenceKeys.LAST_CALENDAR_ID] = aLastCalendarId;

    this._putPreferences();
  },
  getLastCalendarId: function () {
    if (!this.user) {
      return null;
    }

    return this.user[UserPreferenceKeys.LAST_CALENDAR_ID];
  },
  setUserId: function (aUserId) {
    if (!this.user) {
      this.user = {};
    }

    this.user[UserPreferenceKeys.USER_ID] = aUserId;

    this._putPreferences();
  },
  removeUserId: function () {
    if (!this.user) {
      return null;
    }

    delete this.user[UserPreferenceKeys.USER_ID];

    this._putPreferences();
  },
  getUserId: function () {
    return this.user[UserPreferenceKeys.USER_ID];
  },

  /**
   * Remove all previously created group aliases from the preference store.
   */
  removeAllGroupAliases: function () {
    this.groupAliases = new Object();

    this._putPreferences();
  },

  /**
   * Adjust an existing {GameClassificationLevel} within a {LeagueProfile} to have new
   * values for age, level, and regular expression.
   *
   * @param {string} aGroupName The string identifier of the profile in which
   *        the {GameClassificationLevel} exists.
   * @param {string} aSettingId The unique identifier for the {GameClassificationLevel}
   *        within its respective {LeagueProfile}.
   * @param {string} aNewClassification The value to set for the Classification field of the setting.
   * @param {string} aNewLevel The value to set for the Level field of the
   *        setting.
   * @param {string} aNewRegEx The value to set for the Regular Expression field
   *        of the setting.
   */
  adjustGameClassificationLevel: function (aGroupName, aSettingId, aNewClassification, aNewLevel, aNewRegEx) {
    var profile = this.getLeagueProfile(aGroupName);
    var setting = profile.getGameClassificationLevelById(aSettingId);
    setting.setClassification(aNewClassification);
    setting.setLevel(aNewLevel);
    setting.setRegEx(aNewRegEx);

    this._putPreferences();
  },

  /**
   * Remove an existing {GameClassificationLevel} from a {LeagueProfile}.
   *
   * @param {string} aGroupName The string identifier of the {LeagueProfile}
   *        under which the {GameClassificationLevel} to remove resides.
   * @param {string} aSettingId The string identifier of the {GameClassificationLevel}
   *        within its parent {LeagueProfile}.
   */
  removeGameClassificationLevelFromProfile: function (aGroupName, aSettingId) {
    var self = this;
    self.getLeagueProfile(aGroupName).removeGameClassificationLevelById(aSettingId);

    self._putPreferences();
  },
  setAuthTokens: function (aAuthTokens) {
    if (!this.user) {
      this.user = {};
    }

    this.user[UserPreferenceKeys.GOOGLE_AUTH_DATA] = aAuthTokens;

    this._putPreferences();
  },
  getAuthTokens: function () {
    if (!this.user) {
      return null;
    }

    return this.user[UserPreferenceKeys.GOOGLE_AUTH_DATA];
  },

  /**
   * Export this {PreferenceStore} to a string. This is useful for debugging the
   * storage methods.
   *
   * @return {string} The JSON of this object, in string form.
   */
  toString: function () {
    return JSON.stringify(this);
  },

  /**
   * Store preferences to a configuration file in the user's home directory so
   * they can be read back in at a later date.
   */
  _putPreferences: function () {
    if (this.shouldStore) {
      var storedPrefs = fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.cwd(this._getUserHome()).dir(".arbitrator").write("userConfig.json", this);
    }
  },

  /**
   * Retrieve preferences from local storage and populate this object with the
   * data from the store.
   */
  _retrievePreferences: function () {
    var storedPrefs = fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.cwd(this._getUserHome()).read(".arbitrator/userConfig.json", 'json');

    if (this.shouldStore && storedPrefs) {
      this.groupAliases = storedPrefs.groupAliases;
      this.time = storedPrefs.time;
      this.locations = storedPrefs.locations;
      this.user = storedPrefs.user;
      this.leagueProfiles = this._deserializeGameProfiles(storedPrefs.leagueProfiles);
    }
  },
  // TODO: We should separate this into a module that allows for more general
  //       deserialization.
  _deserializeGameProfiles: function (aBaseObject) {
    var profiles = [];

    for (var idx in aBaseObject) {
      profiles.push(this._deserializeSingleGameProfile(aBaseObject[idx]));
    }

    return profiles;
  },
  _deserializeSingleGameProfile: function (aBaseObject) {
    var profile = new _LeagueProfile__WEBPACK_IMPORTED_MODULE_5__["LeagueProfile"](aBaseObject.profileId);

    for (var idx in aBaseObject.classificationLevels) {
      var nextGameClassificationLevel = aBaseObject.classificationLevels[idx];
      profile.addGameClassificationLevel(new _LeagueProfile__WEBPACK_IMPORTED_MODULE_5__["GameClassificationLevel"](nextGameClassificationLevel.classification, nextGameClassificationLevel.level, nextGameClassificationLevel.regularExpression));
    }

    return profile;
  },
  _getUserHome: function () {
    return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
  },
  _verifyExtensibility: function (aProperty) {
    if (!Object.isExtensible(this[aProperty])) {
      // Make a copy of the object, because somewhere along the line, it became
      // non-extensible. :(
      var newObj = {};

      for (var x in this[aProperty]) {
        newObj[x] = this[aProperty][x];
      }

      this[aProperty] = newObj;
    }
  },

  /**
   * Set all game age profiles within this {PreferenceStore}.
   *
   * This is mostly used for testing convenience.
   *
   * @param {Array} gameProfiles An array of {LeagueProfile}s.
   */
  _setLeagueProfiles(gameProfiles) {
    this.leagueProfiles = this._deserializeGameProfiles(gameProfiles);
  },

  /**
   * Clear this {PreferenceStore} of {LeagueProfile} objects.
   */
  _clearLeagueProfiles() {
    this.leagueProfiles = [];
  }

};
var PreferenceSingleton = {};
Object.defineProperty(PreferenceSingleton, "instance", {
  get: function () {
    if (!global[PREFERENCE_STORE_KEY]) {
      global[PREFERENCE_STORE_KEY] = new PreferenceStore();
    }

    return global[PREFERENCE_STORE_KEY];
  }
});
Object.freeze(PreferenceSingleton);

/***/ }),

/***/ "./src/arbitrator/QuickCrypto.js":
/*!***************************************!*\
  !*** ./src/arbitrator/QuickCrypto.js ***!
  \***************************************/
/*! exports provided: QuickCrypto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuickCrypto", function() { return QuickCrypto; });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DeviceInfo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DeviceInfo */ "./src/arbitrator/DeviceInfo.js");


var QuickCrypto = function () {
  var self = this;
  var deviceInfo = _DeviceInfo__WEBPACK_IMPORTED_MODULE_1__["DeviceInfoSingleton"].instance;
  self.mMachineKeyPromise = deviceInfo.getEncryptedDeviceKey();
};
QuickCrypto.prototype = {
  // This is a Promise to a machine key, not an actual one.
  mMachineKeyPromise: null,
  encrypt: function (aData) {
    return new Promise((resolve, reject) => {
      var self = this;
      self.mMachineKeyPromise.then(machineKey => {
        const cipher = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createCipher('aes-256-ofb', machineKey);
        var encrypted = '';
        cipher.on('readable', () => {
          var data = cipher.read();

          if (data) {
            encrypted += data.toString('hex');
          }
        });
        cipher.on('end', () => {
          resolve(encrypted);
        });
        cipher.write(aData);
        cipher.end();
      }).catch(error => {
        reject(error);
      });
    });
  },
  decrypt: function (aEncryptedString) {
    var self = this;
    return new Promise((resolve, reject) => {
      self.mMachineKeyPromise.then(machineKey => {
        const decipher = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.createDecipher('aes-256-ofb', machineKey);
        var decrypted = '';
        decipher.on('readable', () => {
          var data = decipher.read();

          if (data) {
            decrypted += data.toString('utf8');
          }
        });
        decipher.on('end', () => {
          resolve(decrypted);
        });
        decipher.write(aEncryptedString, 'hex');
        decipher.end();
      });
    });
  }
};

/***/ }),

/***/ "./src/arbitrator/StringUtils.js":
/*!***************************************!*\
  !*** ./src/arbitrator/StringUtils.js ***!
  \***************************************/
/*! exports provided: StringUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StringUtils", function() { return StringUtils; });
var StringUtils = {
  capitalize: function (aString) {
    // Split into words and capitalize each word, then re-join the strings.
    var wordArray = aString.split(/\s/);
    var extractedWords = new Array();

    for (var i in wordArray) {
      var value = wordArray[i];

      if (value.length == 0) {
        continue;
      }

      var newWord = value[0].toUpperCase() + value.substr(1);
      extractedWords.push(newWord);
    }

    return extractedWords.join(" ");
  }
};

/***/ }),

/***/ "./src/arbitrator/Strings.js":
/*!***********************************!*\
  !*** ./src/arbitrator/Strings.js ***!
  \***********************************/
/*! exports provided: Strings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Strings", function() { return Strings; });
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_0__);
 // module loaded from npm

var Strings = fs_jetpack__WEBPACK_IMPORTED_MODULE_0___default.a.cwd(__dirname).read('strings.json', 'json');

/***/ }),

/***/ "./src/arbitrator/UIManager.js":
/*!*************************************!*\
  !*** ./src/arbitrator/UIManager.js ***!
  \*************************************/
/*! exports provided: UIManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UIManager", function() { return UIManager; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Place__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Place */ "./src/arbitrator/Place.js");
/* harmony import */ var _ArbitratorGoogleClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ArbitratorGoogleClient */ "./src/arbitrator/ArbitratorGoogleClient.js");
/* harmony import */ var _ArbitratorConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ArbitratorConfig */ "./src/arbitrator/ArbitratorConfig.js");
/* harmony import */ var _StringUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./StringUtils */ "./src/arbitrator/StringUtils.js");
/* harmony import */ var _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PreferenceStore */ "./src/arbitrator/PreferenceStore.js");
/* harmony import */ var _Arbitrator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Arbitrator */ "./src/arbitrator/Arbitrator.js");
/* harmony import */ var _Strings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Strings */ "./src/arbitrator/Strings.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! util */ "util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _LocationService__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./LocationService */ "./src/arbitrator/LocationService.js");
/* harmony import */ var _QuickCrypto__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./QuickCrypto */ "./src/arbitrator/QuickCrypto.js");
/* harmony import */ var lockr__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lockr */ "lockr");
/* harmony import */ var lockr__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(lockr__WEBPACK_IMPORTED_MODULE_11__);













var UIManager = function () {};
UIManager.prototype = {
  mGoogleClient: null,
  mBackStack: new Array(),
  mVersion: '0.0.0',
  mLocationService: new _LocationService__WEBPACK_IMPORTED_MODULE_9__["LocationService"](),

  /**
   * Perform functionality when the user clicks the 'Submit' button to indicate
   * they wish to invoke arbitrator's functionality.
   */
  onArbitrate: function () {
    var scheduleText = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#schedule').val();
    var arb = new _Arbitrator__WEBPACK_IMPORTED_MODULE_6__["Arbitrator"](scheduleText);
    var calSelectionElement = document.getElementById('calendarList');
    var selectedId = calSelectionElement[calSelectionElement.selectedIndex].id;
    arb.adjustGamesOrSubmitToCalendar(selectedId);
  },
  setVersion: function (aVersion) {
    this.mVersion = aVersion;
  },
  getVersion: function () {
    return this.mVersion;
  },
  setUIListeners: function () {
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
  refreshPreferences: function () {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;

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
  refreshProfilePreferences: function () {
    // We need all of the group data to populate the profile names.
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    var aliases = prefStore.getAllGroupAliasNamesAsSortedArray();

    for (var idx in aliases) {
      var name = aliases[idx];

      this._addLeagueProfileSubMenu(name);
    }
  },

  /**
   * Refresh the {GameClassificationLevel} listing view.
   *
   * @param  {String} aGroupName The identifier of the {LeagueProfile} for which
   *                             {GameClassificationLevel}s are being shown.
   */
  refreshGameClassificationLevelPreferences: function (aGroupName) {
    var self = this;
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance; // Hook up the UI for adding a new game age preference.

    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#addNewGameClassificationLevel').off();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#addNewGameClassificationLevel').click(function () {
      self._createNewGameClassificationLevelSetting();
    }); // Remove all children first.

    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#leagueProfileContent').children().remove(); // Load the existing preferences.

    self.loadPartialContent('partials/game-classification-preference.partial.html').then(data => {
      var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
      var gameClassificationSettings = prefStore.getLeagueProfile(aGroupName);

      if (gameClassificationSettings) {
        var levels = gameClassificationSettings.getLevels();

        for (var gameClassificationIdx in levels) {
          var gameClassificationPref = levels[gameClassificationIdx];
          var settingUI = jquery__WEBPACK_IMPORTED_MODULE_0___default()(data);
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
          removeButton.click(function () {
            var parentElement = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).parent();
            var id = parentElement.data('settingId');
            prefStore.removeGameClassificationLevelFromProfile(aGroupName, id);
            self.refreshGameClassificationLevelPreferences(aGroupName);
          });
          modifyButton.attr('id', 'modifyButton-' + gameClassificationPref.getId());
          modifyButton.click(function () {
            var parentElement = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).parent();
            var id = parentElement.data('settingId');
            var inputClassificationWithId = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputClassification-' + id);
            var inputLevelWithId = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputLevel-' + id);
            var inputRegexWithId = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputRegex-' + id);
            prefStore.adjustGameClassificationLevel(aGroupName, id, inputClassificationWithId.val(), inputLevelWithId.val(), inputRegexWithId.val());
            self.showSnackbar(util__WEBPACK_IMPORTED_MODULE_8___default.a.format(_Strings__WEBPACK_IMPORTED_MODULE_7__["Strings"].game_age_preference_updated, inputClassificationWithId.val(), inputLevelWithId.val()));
            self.refreshGameClassificationLevelPreferences(aGroupName);
          });
          jquery__WEBPACK_IMPORTED_MODULE_0___default()('#leagueProfileContent').append(settingUI);
        }
      }
    }).catch(error => {
      console.log("Unable to load game age profile preference template");
    });
  },

  /**
   * Refresh the preference UI from local storage for all time preferences.
   */
  refreshTimePreferences: function () {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    var timePrefs = prefStore.getAllTimePreferences();

    for (var key in timePrefs) {
      if (timePrefs.hasOwnProperty(key)) {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('#timePref-' + key).val(timePrefs[key]);
      }
    }
  },

  /**
   * Refresh the preference UI from local storage for all location preferences.
   */
  refreshLocationPreferences: function () {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
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
  refreshAliasPreferences: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#aliasInputs').html('');
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
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
  setTimePreferenceFromUI: function (aTimePrefName) {
    var timePrefVal = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#timePref-' + aTimePrefName).val();
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    prefStore.addTimePreference(aTimePrefName, timePrefVal);
  },
  setArbiterAuthenticationFromUI: function () {
    var arbiterUsername = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#arbiterUsername').val();
    var arbiterPassword = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#arbiterPassword').val();
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    prefStore.setArbiterAuthentication(arbiterUsername, arbiterPassword);
  },

  /**
   * Add an alias UI element for a given group name and alias.
   *
   * @param aGroupName The name of the group (as specified in the input) for which
   *        an alias was created.
   * @param aGroupAlias The name of the alias to use for this group.
   */
  addAliasUIFor: function (aGroupName, aGroupAlias) {
    var self = this;
    self.loadPartialContent('partials/alias-preference.partial.html').then(data => {
      var dataElement = jquery__WEBPACK_IMPORTED_MODULE_0___default()(data);
      dataElement.find('.originalName').data('actualname', aGroupName).attr('value', aGroupName);
      dataElement.find('.aliasRemoveButton').data('actualname', aGroupName); // If the group name is the same as the alias name, just assume we don't
      // have an alias set.

      if (aGroupAlias != aGroupName) {
        dataElement.find('.aliasName').attr('value', aGroupAlias);
      }

      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#aliasInputs').append(dataElement);

      self._setAliasPreferenceOnClickHandlers();
    }).catch(error => {
      console.error("Unable to load 'partials/alias-preference.partial.html': " + error);
    });
  },
  showSnackbar: function (aMessage) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#snackbar-message').text(aMessage);
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('dialog.snackbar').show();
    setTimeout(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('dialog.snackbar').hide();
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
  addAliasToPrefStore: function (aGroupName, aAliasName) {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    prefStore.addGroupAlias(aGroupName, aAliasName); // this.acknowledgePreference(aGroupName);

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
  setLocationPreference: function (aLocationPrefKey, aLocationPrefName) {
    var self = this;
    var addressElement = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#locationAddressPref-' + aLocationPrefKey);
    var address = addressElement.val();
    var subLocationElement = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#locationSubLocationPref-' + aLocationPrefKey);
    var subLocationName = subLocationElement.val(); // If either the address or sublocation name is empty, and the other is a
    // non-default placeholder, use the placeholder in lieu of the value.

    if (subLocationName && !addressElement.val() && !self._isLocationAddressPlaceholderDefault(addressElement)) {
      address = addressElement.attr('placeholder');
    }

    if (address && !subLocationElement.val() && !self._isLocationSublocationPlaceholderDefault(subLocationElement)) {
      subLocationName = subLocationElement.attr('placeholder');
    }

    var prefName = '';
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    prefStore.addLocationPreference(new _Place__WEBPACK_IMPORTED_MODULE_1__["Place"](aLocationPrefKey, aLocationPrefName, address, subLocationName));
    var addressConfirmed = util__WEBPACK_IMPORTED_MODULE_8___default.a.format(_Strings__WEBPACK_IMPORTED_MODULE_7__["Strings"].address_for_set, aLocationPrefName);
    this.showSnackbar(addressConfirmed);
  },
  deleteLocationPreference: function (aLocationKey) {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    prefStore.removeLocationPreference(aLocationKey);
  },
  deleteAliasPreference: function (aGroupName) {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    prefStore.removeGroupAlias(aGroupName);
  },
  addLocationPreference: function (aPlace) {
    var self = this;
    jquery__WEBPACK_IMPORTED_MODULE_0___default.a.get('partials/location-preference.partial.html', function (data) {
      var dataElement = jquery__WEBPACK_IMPORTED_MODULE_0___default()(data);
      var addressTextInputId = 'locationAddressPref-' + aPlace.getShortName();
      var subLocationTextInputId = 'locationSubLocationPref-' + aPlace.getShortName();
      var addressPlaceholderText = util__WEBPACK_IMPORTED_MODULE_8___default.a.format(_Strings__WEBPACK_IMPORTED_MODULE_7__["Strings"].enter_address_for, aPlace.getName());

      if (aPlace.getAddress()) {
        addressPlaceholderText = aPlace.getAddress();
      }

      var subLocationPlaceholderText = '';

      if (aPlace.hasSubLocation()) {
        subLocationPlaceholderText = aPlace.getSubLocationName();
      }

      dataElement.find('label').attr('for', addressTextInputId).text(aPlace.getName());
      dataElement.find('.locationTextInput').attr('id', addressTextInputId).attr('placeholder', addressPlaceholderText);
      dataElement.find('.locationTextInput.small').attr('id', subLocationTextInputId).attr('placeholder', subLocationPlaceholderText);
      dataElement.find('.locationRemoveButton').data('locationshortname', aPlace.getShortName());
      dataElement.find('.locationSetButton').data('locationshortname', aPlace.getShortName()).data('locationname', aPlace.getName());
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#locationInputs').append(dataElement);
      var addressElement = document.getElementById('locationAddressPref-' + aPlace.getShortName());

      var Typeahead = __webpack_require__(/*! typeahead */ "typeahead"); // Since this method is run every time preferences are refreshed, and in
      // order to generalize the loadContent() method a bit we refresh all
      // preferences on every content load, this should only be called if there
      // actually _is_ a location preference input element in the DOM.


      if (addressElement) {
        // Enable typeahead input on the address input element.
        var locService = new _LocationService__WEBPACK_IMPORTED_MODULE_9__["LocationService"]();
        Typeahead(addressElement, {
          source: function (query, result) {
            locService.getPredictionsForQuery(query, result);
          }
        });

        self._setLocationPreferenceOnClickHandlers();
      }
    });
  },

  /**
   * Open the navigation drawer using a transition animation.
   */
  openNavDrawer: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#nav-drawer').css({
      'transform': 'translate(0px, 0px)'
    });
  },

  /**
   * Close the navigation drawer using a transition animation.
   */
  closeNavDrawer: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#nav-drawer').css({
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
  loadPartialContent: function (aPartialContentPath) {
    return jquery__WEBPACK_IMPORTED_MODULE_0___default.a.get(aPartialContentPath);
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
  loadContent: function (aContentFileName, aTitle, aOnComplete) {
    var self = this; // Set the text of the nav drawer header

    self.closeNavDrawer();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('main#content').load('partials/' + aContentFileName + '.partial.html', null, function () {
      self._addToBackStack({
        'id': aContentFileName,
        'name': aTitle
      });

      if (!self._isBackStackEmpty()) {
        self._showBackArrow();
      } else {
        self._showHamburgerIcon();
      } // Add the title to the app bar.


      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#pageTitle').text(aTitle); // Add the version number to the app bar

      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#versionNumber').text('v' + self.getVersion());

      if (aContentFileName == 'main') {
        self.refreshGoogleClient(function (aGoogleClient) {
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
  refreshGoogleClient: function (aOnComplete) {
    if (this.mGoogleClient == null) {
      this.mGoogleClient = new _ArbitratorGoogleClient__WEBPACK_IMPORTED_MODULE_2__["ArbitratorGoogleClient"]();
    }

    this.mGoogleClient.getClient().then(client => {
      aOnComplete(this.mGoogleClient);
    });
  },

  /**
   * Populate the list of calendars in the main user interface.
   *
   * @param  {[ArbitratorGoogleClient]} aGoogleClient The client with which the
   *                                    api calls should be run with.
   */
  populateCalendarList: function (aGoogleClient) {
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    var lastCalendarId = prefStore.getLastCalendarId();
    var calendarSelector = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#calendarList');
    var noCalendarSelectedOption = jquery__WEBPACK_IMPORTED_MODULE_0___default()('<option id="noCalendarSelectedOption">' + _Strings__WEBPACK_IMPORTED_MODULE_7__["Strings"].select_calendar + '</option>');
    calendarSelector.append(noCalendarSelectedOption);
    aGoogleClient.getCalendarList().then(items => {
      var selectEle = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#calendarList');

      for (var calendarIdx in items) {
        var calendarItem = items[calendarIdx];
        var listItem = jquery__WEBPACK_IMPORTED_MODULE_0___default()('<option></option>');
        listItem.attr('id', calendarItem.id);
        listItem.text(calendarItem.summary);
        selectEle.append(listItem);
      } // Select last calendar


      if (lastCalendarId) {
        var calChildren = calendarSelector.children();
        calChildren.each(function (childNumber) {
          var currentChild = jquery__WEBPACK_IMPORTED_MODULE_0___default()(calChildren[childNumber]);

          if (currentChild.attr('id') == lastCalendarId) {
            currentChild.prop('selected', 'selected');
          }
        }); // calendarSelector.find('option#' + lastCalendarId).prop('selected', 'selected');
      }

      selectEle.css('display', 'block');
    }); // Setup on change event

    calendarSelector.off();
    calendarSelector.change(function (event) {
      prefStore.setLastCalendarId(event.target.selectedOptions[0].id);
    });
  },

  /**
   * Populate the Google+ user id of the user in the preference store.
   *
   * @param  {[ArbitratorGoogleClient]} aGoogleClient The client with which the
   *                                    api calls should be run with.
   */
  populateUserId: function (aGoogleClient) {
    aGoogleClient.getUserId().then(id => {
      var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
      prefStore.setUserId(id);
    });
  },

  /**
   * Clear the main text input to the Arbitrator tool.
   */
  clearArbitratorInput: () => {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#schedule').val('');
  },
  // logout: function() {
  //   var prefStore = PreferenceSingleton.instance;
  //   prefStore.removeUserId();
  //   location.reload();
  // },
  _hidePreferencesBasedOnFeatureFlags: function () {
    if (!_ArbitratorConfig__WEBPACK_IMPORTED_MODULE_3__["ArbitratorConfig"].hasOwnProperty('feature_arbiter_sports_login')) {
      console.warn("Could not find feature flag feature_arbiter_sports_login. Assuming it's set to false.");
    }

    if (_ArbitratorConfig__WEBPACK_IMPORTED_MODULE_3__["ArbitratorConfig"].feature_arbiter_sports_login) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#feature_arbiter_sports_login').show();
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#feature_arbiter_sports_login').hide();
    }
  },

  /**
   * Set all onClick() handlers for preference UI elements.
   */
  _setPreferenceOnClickHandlers: function () {
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
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#setupArbiterConnection').show();
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#connectionIndicator').hide();
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#setupArbiterConnection').hide();
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#connectionIndicator').show();
    }
  },

  _setArbiterConnectionPreferenceOnClickHandlers: function () {
    var self = this;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#setArbiterAuth').click(function () {
      self.setArbiterAuthenticationFromUI();
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#setupArbiterConnection').click(() => {
      self._setConnectionButtonVisible(false);

      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#connection-successful').hide();
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#connection-failed').hide();
      const prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;

      const {
        BrowserWindow,
        app
      } = __webpack_require__(/*! electron */ "electron").remote;

      var ipcRenderer = __webpack_require__(/*! electron */ "electron").ipcRenderer;

      var aspAuth = lockr__WEBPACK_IMPORTED_MODULE_11___default.a.get('ASPXAUTH_ARBITER');
      ipcRenderer.send('arbiter-request-create-window', aspAuth);
      ipcRenderer.on('arbiter-window-closed', (event, message) => {
        self._setConnectionButtonVisible(true);
      });
      ipcRenderer.on('arbiter-authenticated', (event, aspAuth) => {
        lockr__WEBPACK_IMPORTED_MODULE_11___default.a.set("ASPXAUTH_ARBITER", aspAuth); // This next part closes the window and returns a positive
        // authentication status.

        ipcRenderer.send('arbiter-request-destroy-window', true);
      });
      ipcRenderer.on('arbiter-connection-check-finished', (event, wasSuccessful) => {
        if (wasSuccessful) {
          jquery__WEBPACK_IMPORTED_MODULE_0___default()('#connection-successful').show();
          jquery__WEBPACK_IMPORTED_MODULE_0___default()('#connection-failed').hide();
        } else {
          jquery__WEBPACK_IMPORTED_MODULE_0___default()('#connection-successful').hide();
          jquery__WEBPACK_IMPORTED_MODULE_0___default()('#connection-failed').show();
        }
      }); // ipcRenderer.on('arbiter-document-received', (event, dom) => {
      //   console.log(dom);
      // });
    });
  },

  /**
   * Set the onClick() handlers for time preferences.
   */
  _setTimePreferenceOnClickHandlers: function () {
    var self = this;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#setPriorToStart').click(function () {
      var minutes = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#timePref-priorToStart').val();
      self.setTimePreferenceFromUI('priorToStart');
      var priorToStartAcknowledge = util__WEBPACK_IMPORTED_MODULE_8___default.a.format(_Strings__WEBPACK_IMPORTED_MODULE_7__["Strings"].calendar_events_will_start, minutes);
      self.showSnackbar(priorToStartAcknowledge);
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#setGameLength').click(function () {
      var length = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#timePref-gameLength').val();
      self.setTimePreferenceFromUI('gameLength');
      var gameLengthAcknowledge = util__WEBPACK_IMPORTED_MODULE_8___default.a.format(_Strings__WEBPACK_IMPORTED_MODULE_7__["Strings"].calendar_events_length, length);
      self.showSnackbar(gameLengthAcknowledge);
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#setConsecutiveGames').click(function () {
      var consecutiveThresh = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#timePref-consecutiveGames').val();
      self.setTimePreferenceFromUI('consecutiveGames');
      var consecutiveAcknowledge = util__WEBPACK_IMPORTED_MODULE_8___default.a.format(_Strings__WEBPACK_IMPORTED_MODULE_7__["Strings"].consecutive_games_acknowledgement, consecutiveThresh);
      self.showSnackbar(consecutiveAcknowledge);
    });
  },

  /**
   * Set the onClick() handlers for alias/group preferences.
   */
  _setAliasPreferenceOnClickHandlers: function () {
    var self = this;
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('button.setAlias').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).off('click');
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).click(function () {
        var actualName = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).parent().find('.originalName').data('actualname');
        var aliasName = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).parent().find('.aliasName').val();
        self.addAliasToPrefStore(actualName, aliasName);
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.aliasRemoveButton').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).off('click');
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).click(function () {
        self.deleteAliasPreference(jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).data('actualname'));
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).parent().fadeOut(300, function () {
          jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).remove();
        });
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#aliasAddButton').off('click');
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#aliasAddButton').click(function () {
      var actualName = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#aliasAddName').text();
      var aliasName = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#aliasAddAlias').text();
      self.addAliasToPrefStore(actualName, aliasName);
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#aliasAddName').text('');
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#aliasAddAlias').text('');
      self.refreshAliasPreferences();
    });
  },
  _setLocationPreferenceOnClickHandlers: function () {
    var self = this;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.locationSetButton').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).click(function () {
        var locationShortName = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).data('locationshortname');
        var locationName = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).data('locationname');
        self.setLocationPreference(locationShortName, locationName);
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.locationRemoveButton').each(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).click(function () {
        self.deleteLocationPreference(jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).data('locationshortname'));
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).parent().fadeOut(300, function () {
          jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).remove();
        });
      });
    });
  },

  /**
   * Enable the scroll listener so we can determine whether to show the box
   * shadow beneath the app bar. If the view is scrolled, the app bar will have
   * a shadow underneath it. Otherwise, the app bar will have no shadow.
   */
  _setHeaderScrollListener: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).scroll(function () {
      if (jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).scrollTop() == 0) {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('header').css({
          'box-shadow': 'none'
        });
      } else {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('header').css({
          'box-shadow': '0px 2px 10px rgba(0, 0, 0, 0.2)'
        });
      }
    });
  },

  /**
   * Set the onClick() handler for the main "arbitrate" button.
   */
  _setArbitrateOnClickHandler: function () {
    var self = this; // First, remote all handlers that were previousl associated with this
    // button.

    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#arbitrate-button').off();
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#arbitrate-button').click(function () {
      self.onArbitrate();
    });
  },

  /**
   * Set the onClick() handler for the logout link.
   */
  _setLogoutOnClickHandler: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#logoutLink').click(function () {
      this.logout();
    });
  },
  _setDismissSnackBarOnClickHandler: function () {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#dismissSnackbar').click(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#snackbar-message').text('');
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('.snackbar').hide();
    });
  },

  /**
   * Set the onClick() handler for the navigation drawer button (i.e. the
   * hamburger icon). Also sets up all the navigation drawer item onClick()
   * handlers.
   */
  _setNavDrawerOnClickHandlers: function () {
    var self = this;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.nav-drawer-header').click(function () {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#nav-drawer').css({
        'transform': 'translate(-256px, 0px)'
      });
    });
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.nav-drawer-item').each(function () {
      var rawData = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).data('item');
      var unspacedData = rawData.replace(/\s/, '-');
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).click(function () {
        self.loadContent(unspacedData, _StringUtils__WEBPACK_IMPORTED_MODULE_4__["StringUtils"].capitalize(rawData), function () {
          self.refreshPreferences();
        });
      });
    });
  },

  /**
   * Show the back arrow icon in place of the navigation drawer icon and adjust
   * the onClick() functionality for this icon so that it pops from the back
   * stack.
   */
  _showBackArrow: function () {
    var self = this;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#hamburger').css({
      'background': 'no-repeat url("images/back.svg")'
    });

    self._bindEventHandlerForNavMenu(true);
  },

  /**
   * Show the hamburger (navigation drawer indicator) icon and adjust
   * the onClick() functionality for this icon so that it opens the navigation
   * drawer.
   */
  _showHamburgerIcon: function () {
    var self = this;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#hamburger').css({
      'background': 'no-repeat url("images/hamburger.svg")'
    });

    self._bindEventHandlerForNavMenu(false);
  },

  /**
   * Clear current event handlers for the nav menu button in the upper right of
   * the app bar and re-add the appropriate onClick() handler.
   */
  _bindEventHandlerForNavMenu: function (aIsBack) {
    var self = this;
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#hamburger').unbind('click');

    if (aIsBack) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#hamburger').click(function () {
        self._popBackStack();
      });
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#hamburger').click(function () {
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
  _addToBackStack: function (aBackStackEntry) {
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
  _popBackStack: function () {
    var self = this; // Remove the current entry from the back stack first

    this.mBackStack.pop();
    var lastEntry = this.mBackStack.pop();
    this.loadContent(lastEntry.id, lastEntry.name, function () {
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
  _isBackStackEmpty: function () {
    return this._getBackStackSize() == 1;
  },

  /**
   * @return The number of items in the back stack.
   */
  _getBackStackSize: function () {
    return this.mBackStack.length;
  },
  _isLocationAddressPlaceholderDefault: function (aJQueryObject) {
    var defaultPlaceholderPrefix = _Strings__WEBPACK_IMPORTED_MODULE_7__["Strings"].enter_address_for.slice(0, 17);
    return aJQueryObject.attr('placeholder').startsWith(defaultPlaceholderPrefix);
  },
  _isLocationSublocationPlaceholderDefault: function (aJQueryObject) {
    return aJQueryObject.attr('placeholder') == '';
  },

  /**
   * Create a new {GameClassificationLevel} from inputs entered by the user
   * within the current view.
   */
  _createNewGameClassificationLevelSetting: function () {
    var self = this;
    var prefStore = _PreferenceStore__WEBPACK_IMPORTED_MODULE_5__["PreferenceSingleton"].instance; // Grab the values

    var regex = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputRegex').val();
    var age = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputClassification').val();
    var level = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputLevel').val(); // Push to the preference store

    var profileName = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#leagueProfileContent').data('profilename');
    prefStore.addGameClassificationLevelSetting(profileName, age, level, regex); // Refresh the prefs.

    self.refreshGameClassificationLevelPreferences(profileName);
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputClassification').val('');
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputLevel').val('');
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#gameClassificationInputRegex').val('');
  },

  /**
   * Add a new sub-menu option to the {LeagueProfile} listing corresponding to
   * a given group alias.
   *
   * Note that this also sets up the click handler for the given sub-menu so
   * that it transitions it to the league profile detail view.
   *
   * @param {String} aName The name of a {LeagueProfile} to display in the
   *                       listing.
   */
  _addLeagueProfileSubMenu: function (aName) {
    var self = this;
    self.loadPartialContent('partials/league-profile-preference.partial.html').then(partialContent => {
      var partialContentDOM = jquery__WEBPACK_IMPORTED_MODULE_0___default()(partialContent);
      partialContentDOM.find('.league-profile-label').append(aName);
      partialContentDOM.click(function () {
        self.loadContent('league-profile', aName + " Game Classification Profile", function () {
          jquery__WEBPACK_IMPORTED_MODULE_0___default()('#leagueProfileContent').data('profilename', aName);
          self.refreshGameClassificationLevelPreferences(aName);
        });
      });
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('#levelsContent').append(partialContentDOM);
    }).catch(error => {
      console.error("Unable to load 'partials/league-profile-preference.partial.html': " + error);
    });
  }
};

/***/ }),

/***/ "./src/helpers/window.js":
/*!*******************************!*\
  !*** ./src/helpers/window.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_1__);
// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.


/* harmony default export */ __webpack_exports__["default"] = (function (name, options) {
  var userDataDir = fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default.a.cwd(electron__WEBPACK_IMPORTED_MODULE_0__["app"].getPath('userData'));
  var stateStoreFile = 'window-state-' + name + '.json';
  var defaultSize = {
    width: options.width,
    height: options.height,
    icon: 'resources/icons/512x512.png'
  };
  var state = {};
  var win;

  var restore = function () {
    var restoredState = {};

    try {
      restoredState = userDataDir.read(stateStoreFile, 'json');
    } catch (err) {// For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }

    return Object.assign({}, defaultSize, restoredState);
  };

  var getCurrentPosition = function () {
    var position = win.getPosition();
    var size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    };
  };

  var windowWithinBounds = function (windowState, bounds) {
    return windowState.x >= bounds.x && windowState.y >= bounds.y && windowState.x + windowState.width <= bounds.x + bounds.width && windowState.y + windowState.height <= bounds.y + bounds.height;
  };

  var resetToDefaults = function (windowState) {
    var bounds = electron__WEBPACK_IMPORTED_MODULE_0__["screen"].getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    });
  };

  var ensureVisibleOnSomeDisplay = function (windowState) {
    var visible = electron__WEBPACK_IMPORTED_MODULE_0__["screen"].getAllDisplays().some(function (display) {
      return windowWithinBounds(windowState, display.bounds);
    });

    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults(windowState);
    }

    return windowState;
  };

  var saveState = function () {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }

    userDataDir.write(stateStoreFile, state, {
      atomic: true
    });
  };

  state = ensureVisibleOnSomeDisplay(restore());
  win = new electron__WEBPACK_IMPORTED_MODULE_0__["BrowserWindow"](Object.assign({}, options, state));
  win.on('close', saveState);
  return win;
});

/***/ }),

/***/ "./src/test/Arbitrator.spec.js":
/*!*************************************!*\
  !*** ./src/test/Arbitrator.spec.js ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arbitrator_Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../arbitrator/Game */ "./src/arbitrator/Game.js");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chai */ "chai");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chai__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! env */ "./config/env_test.json");
var env__WEBPACK_IMPORTED_MODULE_2___namespace = /*#__PURE__*/__webpack_require__.t(/*! env */ "./config/env_test.json", 1);
/* harmony import */ var _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../arbitrator/Arbitrator */ "./src/arbitrator/Arbitrator.js");
/* harmony import */ var _CheckGame__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CheckGame */ "./src/test/CheckGame.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../arbitrator/PreferenceStore */ "./src/arbitrator/PreferenceStore.js");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_7__);








var singleGame = fs_jetpack__WEBPACK_IMPORTED_MODULE_7___default.a.read('src/test/fixtures/singleGame.txt');
var basicSchedule = fs_jetpack__WEBPACK_IMPORTED_MODULE_7___default.a.read('src/test/fixtures/basicSchedule.txt');
var complexSchedule = fs_jetpack__WEBPACK_IMPORTED_MODULE_7___default.a.read('src/test/fixtures/complexSchedule.txt');
var testProfiles = fs_jetpack__WEBPACK_IMPORTED_MODULE_7___default.a.read('src/test/fixtures/testProfiles.json', 'json');
describe("Arbitrator Translation Functionality", function () {
  beforeEach(function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["PreferenceSingleton"].instance;

    prefStore._setLeagueProfiles(testProfiles.LeagueProfiles);
  });
  afterEach(function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["PreferenceSingleton"].instance;

    prefStore._clearLeagueProfiles();
  });
  it("should have three LeagueProfiles in preferences", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["PreferenceSingleton"].instance;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore.getAllLeagueProfiles()).to.have.lengthOf(3);
  });
  it("parses a basic string with two games", function () {
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](basicSchedule);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator.getNumGames()).to.equal(2);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator.getGameById(1827)).to.be.null;
    var firstGame = arbitrator.getGameById(1111);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(firstGame).to.not.be.null; // TODO: This is the old way of doing things. It would be very nice if we
    // could instead do something like:
    // expect(firstGame).to.be.a('game').withId(1111).withGroup('106016').withRole(Role.REFEREE)...

    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 1111, '106016', _arbitrator_Game__WEBPACK_IMPORTED_MODULE_0__["Role"].REFEREE, 11, 9, 2013, 12, 30, 'U12 B', 'Bloomington Ice Garden 1', 'Bloomington', 'Minnetonka Black', false, false);
    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 598, 'Showcase', _arbitrator_Game__WEBPACK_IMPORTED_MODULE_0__["Role"].LINESMAN, 4, 26, 2014, 20, 15, 'U16 AAA', 'Saint Louis Park, East', 'TBA', 'TBA', false, false);
  });
  it("parses tournaments and scrimmages correctly", function () {
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](complexSchedule);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator.getNumGames()).to.equal(8); // Check the characteristics of the first game.

    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 4073, _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], false, true); // Check the characteristics of the second game.

    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 203, _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], true); // Check the summary strings to make sure they are reasonable.

    var game1 = arbitrator.getGameById(4073);
    var expectedSS1 = "[106016] Referee (Squirt C Tournament)";
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game1.getSummaryString()).to.equal(expectedSS1);
    var game2 = arbitrator.getGameById(203);
    var expectedSS2 = "[106016] Referee Scrimmage New Prague v Farmington (U10 B)";
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game2.getSummaryString()).to.equal(expectedSS2);
  });
  it("parses complex schedules with many games", function () {
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](complexSchedule);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator.getNumGames()).to.equal(8); // Test don't care terms.

    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 330); // Check the characteristics of the first game.

    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["PreferenceSingleton"].instance;
    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 330, '106016', _arbitrator_Game__WEBPACK_IMPORTED_MODULE_0__["Role"].REFEREE, 11, 8, 2014, 9, 50, "Squirt C", "New Prague Community Center", "New Prague", "Dodge County Black"); // Check the characteristics of the second game.

    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 339, '106016', _arbitrator_Game__WEBPACK_IMPORTED_MODULE_0__["Role"].REFEREE, 11, 8, 2014, 18, 45, "U10 B", "Eden Prairie 3", "Eden Prairie Red", "Minnetonka Black"); // Check the characteristics of the third game.

    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 3839, 'MinneapHO', _arbitrator_Game__WEBPACK_IMPORTED_MODULE_0__["Role"].LINESMAN, 11, 14, 2014, 20, 10, "High School Boys Varsity", "St. Louis Park Recreation Center", "St Thomas Academy", "Minnetonka");
  });
  it("does not truncate the start time", function () {
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](complexSchedule);
    var game = arbitrator.getGameById(5629);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game).to.be.ok;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getTime12Hr()).to.equal("11:00am");
  });
  it("outputs JSON formatted for Google calendar", function () {
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](complexSchedule);
    var game = arbitrator.getGameById(5629);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game).to.be.ok;
    var gameJson = game.getEventJSON();
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gameJson).to.be.ok;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getISOStartDate()).to.equal(gameJson.start.dateTime);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getISOEndDate()).to.equal(gameJson.end.dateTime);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getSite().getName()).to.equal(gameJson.location);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getSummaryString()).to.equal(gameJson.summary);
    var notes = "Game starts at " + String(game.getTime12Hr()) + "\n\n" + game.getEncipheredGameInfoString();
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(notes).to.equal(gameJson.description);
  });
  it("records no preparation time for consecutive games", function () {
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](complexSchedule);
    var game1 = arbitrator.getGameById(5694);
    var game2 = arbitrator.getGameById(5695);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game1).to.be.ok;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game2).to.be.ok;
    var expectedFirstStartTime = game1.getTimestamp().subtract(30, 'minutes');
    var expectedSecondStartTime = game2.getTimestamp();
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game1.getISOStartDate()).to.equal(expectedFirstStartTime.toISOString());
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game2.isConsecutiveGame()).to.be.ok;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game2.getISOStartDate()).to.equal(expectedSecondStartTime.toISOString());
  });
  it("intializes preferences to sane defaults", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["PreferenceSingleton"].instance;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore.hasAliasedGroups()).to.be.ok;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore.hasTimePreferences()).to.not.be.ok;
  });
  it("recognizes time preferences set prior to parsing strings", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["PreferenceSingleton"].instance;
    prefStore.addTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["TimePreferenceKeys"].PRIOR_TO_START, 61);
    prefStore.addTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["TimePreferenceKeys"].LENGTH_OF_GAME, 90);
    prefStore.addGroupAlias('106016', 'D6');
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](basicSchedule);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator.getNumGames()).to.equal(2);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore.getTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["TimePreferenceKeys"].PRIOR_TO_START)).to.equal(61);
    var game = arbitrator.getGameById(1111);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getISOStartDate()).to.equal(moment__WEBPACK_IMPORTED_MODULE_5__("11/9/2013 12:30 PM").subtract(61, 'minutes').toISOString());
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getISOEndDate()).to.equal(moment__WEBPACK_IMPORTED_MODULE_5__("11/9/2013 12:30 PM").add(90, 'minutes').toISOString());
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["assert"])(game.getEventJSON().description.indexOf("Game starts at 12:30pm") > -1, 'the game should start at 12:30pm and this should be in the calendar event description');
    prefStore.removeTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["TimePreferenceKeys"].PRIOR_TO_START);
    prefStore.removeTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["TimePreferenceKeys"].LENGTH_OF_GAME);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getISOEndDate()).to.equal("2013-11-09T19:30:00.000Z");
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getISOStartDate()).to.equal("2013-11-09T18:00:00.000Z");
  });
  it("outputs the correct start and end dates when end date is days in the future", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["PreferenceSingleton"].instance;
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](singleGame);
    var game = arbitrator.getGameById(5422);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game).to.be.ok;
    prefStore.addTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["TimePreferenceKeys"].PRIOR_TO_START, 60);
    prefStore.addTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["TimePreferenceKeys"].LENGTH_OF_GAME, 120); // Basic game checking

    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 5422, _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], _CheckGame__WEBPACK_IMPORTED_MODULE_4__["DONTCARE"], 11, 22, 2014, 20, 40); // Check ISO start and end times

    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getISOStartDate()).to.equal("2014-11-23T01:40:00.000Z");
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(game.getISOEndDate()).to.equal("2014-11-23T04:40:00.000Z");
  });
  it("correctly recognizes group aliases", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_6__["PreferenceSingleton"].instance;
    prefStore.addGroupAlias('106016', 'D6');
    var testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013\n598 		Showcase 	Linesman 	4/26/2014 Sat 8:15 PM 	Hockey, 16U AAA 	Saint Louis Park, East 	TBA 	TBA 	$38.00";
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](testString);
    Object(_CheckGame__WEBPACK_IMPORTED_MODULE_4__["checkGame"])(arbitrator, 1111, 'D6');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore.hasAliasedGroups()).to.be.ok;
    prefStore.removeGroupAlias('D6');
  });
  it("should correctly compute an identification string and hash for valid games", function () {
    var arbitrator = new _arbitrator_Arbitrator__WEBPACK_IMPORTED_MODULE_3__["Arbitrator"](basicSchedule);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator.getNumGames()).to.equal(2);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(arbitrator.getGameById(1827)).to.be.null;
    var firstGame = arbitrator.getGameById(1111);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(firstGame).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(firstGame.getIdentificationString()).to.eq("106016-##-1111");
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(firstGame.getGameInfoCipher()).to.eq('01dc268ac96e58bc8580faceb174');
  });
  it("should be able to resolve a game cipher back to a game id and group", function () {
    var gameInfo = _arbitrator_Game__WEBPACK_IMPORTED_MODULE_0__["Game"].getGameInfoFromCipher('01dc268ac96e58bc8580faceb174');
    var groupId = gameInfo.groupId;
    var gameId = gameInfo.gameId;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(groupId).to.eq('106016');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gameId).to.eq('1111');
  });
});

/***/ }),

/***/ "./src/test/CheckGame.js":
/*!*******************************!*\
  !*** ./src/test/CheckGame.js ***!
  \*******************************/
/*! exports provided: DONTCARE, checkGame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DONTCARE", function() { return DONTCARE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkGame", function() { return checkGame; });
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chai */ "chai");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chai__WEBPACK_IMPORTED_MODULE_0__);
 // Just a gibberish string to represent a "Don't Care" term.

var DONTCARE = 'jahjsya76817261kaqysgagasva9121879aksahdfa612';
/**
 * Check the parameters of a given game. You can use this to check any game
 * against expected values, and either pass the above 'DONTCARE' constant if
 * you don't care about a given term, or leave the parameter undefined.
 *
 * @param aArbitrator The Arbitrator object used to parse the data. Cannot be undefined.
 * @param aGameId The id of the game, as an integer. Cannot be undefined.
 * @param aExpectedGroup The expected 'group' for the game.
 * @param aExpectedRole The expected role of the official for the game. Must be
 *        one of Role.LINESMAN or Role.REFEREE.
 * @param aExpectedDayOfMonth The day of the month (1-31) for the game.
 * @param aExpectedMonth The expected month of the game, as a 0-indexed integer.
 *        (0 = JANUARY, 1 = FEBRUARY, etc...).
 * @param aExpectedYear The expected year of the game, as a four digit integer.
 * @param aExpectedHourOfDay The expected hour in the day for the game, as a
 *        0-indexed integer representing 24 possible hours (0 = 1am, 1=2am,
 *        16 = 4pm, etc...)
 * @param aExpectedMinuteOfHour The expected minute of the hour for the game, as
 *        a 0-indexed integer from 0-59.
 * @param aExpectedLevel The expected level of the game, as parsed from the
          getSportLevel() string.
 * @param aExpectedSite The site of the game, as a string. This must represent
 *        EXACTLY how the online site has it listed. No resolution of lat/long
 *        is currently performed.
 * @param aExpectedHomeTeam The name of the home team of the game.
 * @param aExpectedAwayTeam The name of the away team of the game.
 * @param aExpectScrimmage Whether or not this game is expected to be a scrimmage
 * @param aExpectTournament Whether or not this game is expected to be a
 *        tournament game.
 */

var checkGame = function (aArbitrator, aGameId, aExpectedGroup, aExpectedRole, aExpectedMonth, aExpectedDayOfMonth, aExpectedYear, aExpectedHourOfDay, aExpectedMinuteOfHour, aExpectedLevel, aExpectedSite, aExpectedHomeTeam, aExpectedAwayTeam, aExpectScrimmage, aExpectTournament) {
  // Only the game id and arbitrator must be present. All other things can be
  // undefined, indicating a "don't care" term.
  Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(aArbitrator).to.be.ok;
  Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(aGameId).to.be.ok;
  var game = aArbitrator.getGameById(aGameId);
  Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game).to.be.ok;

  if (aExpectedGroup && aExpectedGroup != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game.getGroup()).to.equal(aExpectedGroup);
  }

  if (aExpectedRole && aExpectedRole != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game.getRole()).to.equal(aExpectedRole);
  }

  var moment = game.getTimestamp();

  if (aExpectedMonth && aExpectedMonth != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(moment.month() + 1).to.equal(aExpectedMonth);
  }

  if (aExpectedDayOfMonth && aExpectedDayOfMonth != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(moment.date()).to.equal(aExpectedDayOfMonth);
  }

  if (aExpectedYear && aExpectedYear != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(moment.year()).to.equal(aExpectedYear);
  }

  if (aExpectedHourOfDay && aExpectedHourOfDay != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(moment.hour()).to.equal(aExpectedHourOfDay);
  }

  if (aExpectedMinuteOfHour && aExpectedMinuteOfHour != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(moment.minute()).to.equal(aExpectedMinuteOfHour);
  }

  if (aExpectedLevel && aExpectedLevel != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game.getLevel()).to.equal(aExpectedLevel);
  }

  if (aExpectedSite && aExpectedSite != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game.getSite().getName()).to.equal(aExpectedSite);
  }

  if (aExpectedHomeTeam && aExpectedHomeTeam != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game.getHomeTeam()).to.equal(aExpectedHomeTeam);
  }

  if (aExpectedAwayTeam && aExpectedAwayTeam != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game.getAwayTeam()).to.equal(aExpectedAwayTeam);
  }

  if (aExpectScrimmage && aExpectScrimmage != DONTCARE) {
    if (aExpectTournament && aExpectTournament != DONTCARE) {
      assert.fail(isExpectScrimmage, isExpectTournament, 'cannot have a game that is both a tournament game and a scrimmage');
    }

    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game.isScrimmage()).to.equal(aExpectScrimmage);
  }

  if (aExpectTournament && aExpectTournament != DONTCARE) {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(game.isTournament()).to.equal(aExpectTournament);
  }
};

/***/ }),

/***/ "./src/test/DeviceInfo.spec.js":
/*!*************************************!*\
  !*** ./src/test/DeviceInfo.spec.js ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chai */ "chai");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chai__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _arbitrator_DeviceInfo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../arbitrator/DeviceInfo */ "./src/arbitrator/DeviceInfo.js");


var deviceInfo = _arbitrator_DeviceInfo__WEBPACK_IMPORTED_MODULE_1__["DeviceInfoSingleton"].instance;
describe("Hardware-Specific Device Information Retrieval", function () {
  it("should retrieve the same encrypted machine key for multiple queries within a single session", function (done) {
    deviceInfo.getEncryptedDeviceKey().then(machineKey1 => {
      Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(machineKey1).to.have.lengthOf(64);
      deviceInfo.getEncryptedDeviceKey().then(machineKey2 => {
        Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(machineKey2).to.have.lengthOf(64);
        Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(machineKey1).to.eq(machineKey2);
        done();
      }).catch(error => {
        done(error);
      });
    }).catch(error => {
      done(error);
    });
  });
  it("is able to retrieve an encrypted machine key of length 64 bytes", function (done) {
    deviceInfo.getEncryptedDeviceKey().then(machineKey => {
      Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(machineKey).to.have.lengthOf(64);
      done();
    }).catch(error => {
      done(error);
    });
  });
  it("is able to retrieve a machine identifer which is a collection of other attributes", function (done) {
    deviceInfo.getMachineIdentifier().then(machineId => {
      deviceInfo.getMacAddress().then(macAddress => {
        var expectedMachineId = deviceInfo.getOSName() + deviceInfo.getOSVersion() + deviceInfo.getCPUModel() + macAddress;
        Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(machineId).to.eql(expectedMachineId);
        done();
      }).catch(aError => {
        done(aError);
      });
    }).catch(error => {
      done(error);
    });
  });
  it("is able to retrieve the OS version", function () {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(deviceInfo.getOSVersion()).to.not.be.null;
  });
  it("is able to retrieve the OS platform name", function () {
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(deviceInfo.getOSName()).to.not.be.null;
  });
  it("is able to retrieve the CPU model", function () {
    var cpuModel = deviceInfo.getCPUModel();
    Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(cpuModel).to.not.be.null;
  });
  it("is able to retrieve the device mac address", function (done) {
    deviceInfo.getMacAddress().then(macAddress => {
      // The device's mac address should be 6 sets of two hexidecimal digits.
      var numSections = macAddress.split(':');
      Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(numSections).to.have.lengthOf(6);

      for (var i = 0; i < numSections.length; i++) {
        var section = numSections[i];
        Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(section).to.have.lengthOf(2);
      }

      done();
    }).catch(error => {
      done(error);
    });
  });
});

/***/ }),

/***/ "./src/test/LeagueProfile.spec.js":
/*!****************************************!*\
  !*** ./src/test/LeagueProfile.spec.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../arbitrator/LeagueProfile */ "./src/arbitrator/LeagueProfile.js");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chai */ "chai");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chai__WEBPACK_IMPORTED_MODULE_1__);


describe('Game Classification and Level Parsing Functionality', () => {
  it('should be able to create GameClassificationLevel objects', () => {
    var gal = new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_0__["GameClassificationLevel"]('Bantam', 'A', '.*');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.getClassification()).to.eq('Bantam');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.getLevel()).to.eq('A');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.matches("Hockey, Bantam A / AA")).to.eq(true);
  });
  it('should recognize "D6, BB214 Tournament" as a Bantam level B2 game', () => {
    var gal = new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_0__["GameClassificationLevel"]('Bantam', 'B2', '[Bantam|B](.*)[B2]');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.getClassification()).to.eq('Bantam');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.getLevel()).to.eq('B2');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.matches("D6, BB214 Tournament")).to.eq(true);
  });
  it('should not recognize "Hockey, Bantam A / AA" as a Bantam level B2 game', () => {
    var gal = new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_0__["GameClassificationLevel"]('Bantam', 'B2', '[Bantam|B](.*)[B2]');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.getClassification()).to.eq('Bantam');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.getLevel()).to.eq('B2');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gal.matches("Hockey, Bantam A / AA")).to.eq(false);
  });
  it('should be able to remove GameClassificationLevel objects from a LeagueProfile', function () {
    var gal1 = new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_0__["GameClassificationLevel"]('Bantam', 'A', '.*');
    var gal2 = new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_0__["GameClassificationLevel"]('[Bantam|B](.*)[B2]', 'Bantam', 'B2');
    var gameProfile = new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_0__["LeagueProfile"]('dontcare');
    gameProfile.addGameClassificationLevel(gal1);
    gameProfile.addGameClassificationLevel(gal2);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gameProfile.getLevels()).to.have.lengthOf(2);
    gameProfile.removeGameClassificationLevel(gal2);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(gameProfile.getLevels()).to.have.lengthOf(1);
  });
});

/***/ }),

/***/ "./src/test/PreferenceStore.spec.js":
/*!******************************************!*\
  !*** ./src/test/PreferenceStore.spec.js ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../arbitrator/PreferenceStore */ "./src/arbitrator/PreferenceStore.js");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chai */ "chai");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chai__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../arbitrator/LeagueProfile */ "./src/arbitrator/LeagueProfile.js");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_3__);




var testProfiles = fs_jetpack__WEBPACK_IMPORTED_MODULE_3___default.a.read('src/test/fixtures/testProfiles.json', 'json');
describe("Preference Storage and Retrieval", function () {
  it("is able to retrieve an instance of the PreferenceStore", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["PreferenceSingleton"].instance;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore).to.be.ok;
  });
  it("is able to set a preference in a single instance and retrieve it in another", function () {
    var prefStore1 = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["PreferenceSingleton"].instance;
    var prefStore2 = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["PreferenceSingleton"].instance;
    prefStore1.addTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["TimePreferenceKeys"].PRIOR_TO_START, 61);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore2.getTimePreference(_arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["TimePreferenceKeys"].PRIOR_TO_START)).to.equal(61);
  });
  it("is able to add a new game age profile and subsequently retrieve it", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["PreferenceSingleton"].instance;
    var profile = new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_2__["LeagueProfile"]('D6');
    profile.addGameClassificationLevel(new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_2__["GameClassificationLevel"]('Bantam', 'B2', '[Bantam|B](.*)[B2]'));
    prefStore.addLeagueProfile(profile);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore.getLeagueProfile('D6')).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(prefStore.getLeagueProfile('D6').getNumLevels()).to.eq(1);
    var GameClassificationLevelMatching = prefStore.getLeagueProfile('D6').findGameClassificationLevelMatching('D6, BB214 Tournament');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(GameClassificationLevelMatching).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(GameClassificationLevelMatching.getClassification()).to.eq('Bantam');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(GameClassificationLevelMatching.getLevel()).to.eq('B2');
  });
  it("should return an array of GameClassificationLevel objects that are sorted first by age then by level", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["PreferenceSingleton"].instance;

    prefStore._setLeagueProfiles(testProfiles.LeagueProfiles);

    var district6Profile = prefStore.getLeagueProfile('106016');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(district6Profile).to.not.be.null;
    var levels = district6Profile.getLevels();
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(levels).to.have.lengthOf(5);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(levels[0].getClassification()).to.eq('Squirt');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(levels[0].getLevel()).to.eq('B');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(levels[1].getClassification()).to.eq('Squirt');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(levels[1].getLevel()).to.eq('C');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(levels[2].getClassification()).to.eq('U10');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(levels[3].getClassification()).to.eq('U12');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(levels[4].getClassification()).to.eq('U15');

    prefStore._clearLeagueProfiles();
  });
  it("is able to update an existing LeagueProfile to add new values", function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["PreferenceSingleton"].instance;
    var profile = new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_2__["LeagueProfile"]('D6');
    profile.addGameClassificationLevel(new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_2__["GameClassificationLevel"]('Bantam', 'B2', '[Bantam|B](.*)[B2]'));
    prefStore.addLeagueProfile(profile);
    profile.addGameClassificationLevel(new _arbitrator_LeagueProfile__WEBPACK_IMPORTED_MODULE_2__["GameClassificationLevel"]('Squirt', 'A', '.*'));
    prefStore.setLeagueProfile(profile);
    var retrieved = prefStore.getLeagueProfile('D6');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(retrieved).to.not.be.null;
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(retrieved.getNumLevels()).to.eq(2);
  });
  it('is able to add a series of group aliases and get their names in alpha order', function () {
    var prefStore = _arbitrator_PreferenceStore__WEBPACK_IMPORTED_MODULE_0__["PreferenceSingleton"].instance;
    prefStore.addGroupAlias('106016', 'District 6');
    prefStore.addGroupAlias('MinneapHO', 'MHOA');
    var aliasNames = prefStore.getAllGroupAliasNamesAsSortedArray();
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(aliasNames).to.have.lengthOf(4);
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(aliasNames[0]).to.eq('District 6');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(aliasNames[1]).to.eq('MHOA');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(aliasNames[2]).to.eq('OSL');
    Object(chai__WEBPACK_IMPORTED_MODULE_1__["expect"])(aliasNames[3]).to.eq('Showcase');
  });
});

/***/ }),

/***/ "./src/test/QuickCrypto.spec.js":
/*!**************************************!*\
  !*** ./src/test/QuickCrypto.spec.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chai */ "chai");
/* harmony import */ var chai__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chai__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _arbitrator_QuickCrypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../arbitrator/QuickCrypto */ "./src/arbitrator/QuickCrypto.js");


describe('Quick Cryptological Functions', function () {
  var quickCrypto = new _arbitrator_QuickCrypto__WEBPACK_IMPORTED_MODULE_1__["QuickCrypto"]();
  it("should be able to decrypt a previously encrypted password", function (done) {
    var expectedPassword = 'somePasswordThatMayOrMayNotBeSecure';
    quickCrypto.encrypt(expectedPassword).then(encryptedVersion => {
      Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(encryptedVersion).to.not.be.empty;
      quickCrypto.decrypt(encryptedVersion).then(decryptedVersion => {
        Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(decryptedVersion).to.not.be.empty;
        Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(expectedPassword).to.eq(decryptedVersion);
        done();
      }).catch(error => {
        done(error);
      });
    }).catch(error => {
      done(error);
    });
  });
  it("should be able to encrypt a password", function (done) {
    quickCrypto.encrypt('somePasswordThatMayOrMayNotBeSecure').then(encryptedVersion => {
      Object(chai__WEBPACK_IMPORTED_MODULE_0__["expect"])(encryptedVersion).to.not.be.empty;
      done();
    }).catch(error => {
      done(error);
    });
  });
});

/***/ }),

/***/ "./temp/specs_entry.js":
/*!*****************************!*\
  !*** ./temp/specs_entry.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_test_Arbitrator_spec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/test/Arbitrator.spec.js */ "./src/test/Arbitrator.spec.js");
/* harmony import */ var _src_test_DeviceInfo_spec_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/test/DeviceInfo.spec.js */ "./src/test/DeviceInfo.spec.js");
/* harmony import */ var _src_test_LeagueProfile_spec_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/test/LeagueProfile.spec.js */ "./src/test/LeagueProfile.spec.js");
/* harmony import */ var _src_test_PreferenceStore_spec_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/test/PreferenceStore.spec.js */ "./src/test/PreferenceStore.spec.js");
/* harmony import */ var _src_test_QuickCrypto_spec_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/test/QuickCrypto.spec.js */ "./src/test/QuickCrypto.spec.js");






/***/ }),

/***/ "@google/maps":
/*!*******************************!*\
  !*** external "@google/maps" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@google/maps");

/***/ }),

/***/ "chai":
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "fs-jetpack":
/*!*****************************!*\
  !*** external "fs-jetpack" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs-jetpack");

/***/ }),

/***/ "googleapis":
/*!*****************************!*\
  !*** external "googleapis" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("googleapis");

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jquery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jquery");

/***/ }),

/***/ "lockr":
/*!************************!*\
  !*** external "lockr" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lockr");

/***/ }),

/***/ "macaddress":
/*!*****************************!*\
  !*** external "macaddress" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("macaddress");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "node-rest-client":
/*!***********************************!*\
  !*** external "node-rest-client" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-rest-client");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "typeahead":
/*!****************************!*\
  !*** external "typeahead" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("typeahead");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=specs.js.map