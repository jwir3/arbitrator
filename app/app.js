(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var $ = _interopDefault(require('jquery'));
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));
var google = require('googleapis');
var fs = require('fs');
var path = require('path');
var CryptoJS = require('crypto-js');
var moment = require('moment');

/**
 * A Place consists of a name, a shorter name (the alias used within Arbiter to
 * identify the site), an address, and a sub-location name (possibly blank). The
 * address may be undefined if no address was specified for this Place.
 */
var Place = function(aShortName, aName, aAddress, aSubLocationName) {
  this.mShortName = aShortName;
  this.mName = aName;
  this.mAddress = aAddress;
  this.mSubLocationName = aSubLocationName;
}

Place.prototype = {
  getShortName: function() {
    return this.mShortName;
  },

  getName: function() {
    return this.mName;
  },

  getAddress: function() {
    return this.mAddress;
  },

  getSubLocationName: function() {
    return this.mSubLocationName;
  },

  hasSubLocation: function() {
    return this.getSubLocationName() != "";
  }
}

var secret = {
  "googleClientId": "609265890429-0evcp2uqktl726lf6ijfu56fpkh8c7cv.apps.googleusercontent.com",
  "googleClientSecret": "m-hzuH_h2O81XJkd2xNYY6QU"

  // "alpha": {
  //   "googleClientId": "609265890429-c5d69skkd9o2f1fksco00294oom2burf.apps.googleusercontent.com",
  //   "googleAPIKey": "AIzaSyDkiyjtUnxlzQUyxnu0WqUtkhyV8Q2KyA0"
  // },
  //
  // "beta": {
  //   "googleClientId": "609265890429-n8ottusag6nrsekmddusvlkl159gqpcg.apps.googleusercontent.com",
  //   "googleAPIKey": "AIzaSyDCOT-fmjG2gnAtVXfSceL41Od8WykmRcE"
  // },
  //
  // "release": {
  //   "googleClientId": "609265890429-7j1d1dfo11m1h35gboc4cr4fejcglmhl.apps.googleusercontent.com",
  //   "googleAPIKey": "AIzaSyAYQEmBt5F_-CxcTuaIScgFv_SeYtzfikc"
  // }
};

var ArbitratorConfig = {
  /**
   * Set this value to the Google Web Application Client ID you generated when
   * creating a new OAuth2 permission in your Google Developer Console.
   */

  // NOTE: These values should all be injected, based on the appropriate
  //       environment, during the build.
  'google_client_id': secret.googleClientId,
  'google_client_secret': secret.googleClientSecret,
  'version_number': "2.0.0"
};

// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.

function createWindow (name, options) {

    var userDataDir = jetpack.cwd(electron.app.getPath('userData'));
    var stateStoreFile = 'window-state-' + name +'.json';
    var defaultSize = {
        width: options.width,
        height: options.height
    };
    var state = {};
    var win;

    var restore = function () {
        var restoredState = {};
        try {
            restoredState = userDataDir.read(stateStoreFile, 'json');
        } catch (err) {
            // For some reason json can't be read (might be corrupted).
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
        return windowState.x >= bounds.x &&
            windowState.y >= bounds.y &&
            windowState.x + windowState.width <= bounds.x + bounds.width &&
            windowState.y + windowState.height <= bounds.y + bounds.height;
    };

    var resetToDefaults = function (windowState) {
        var bounds = electron.screen.getPrimaryDisplay().bounds;
        return Object.assign({}, defaultSize, {
            x: (bounds.width - defaultSize.width) / 2,
            y: (bounds.height - defaultSize.height) / 2
        });
    };

    var ensureVisibleOnSomeDisplay = function (windowState) {
        var visible = electron.screen.getAllDisplays().some(function (display) {
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
        userDataDir.write(stateStoreFile, state, { atomic: true });
    };

    state = ensureVisibleOnSomeDisplay(restore());

    win = new electron.BrowserWindow(Object.assign({}, options, state));

    win.on('close', saveState);

    return win;
}

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
var env = jetpack.cwd(__dirname).read('env.json', 'json');

const PREFERENCE_STORE_KEY = Symbol("PreferenceStore");

/**
 * An object connected to local storage for persistent storage of setting
 * data.
 */
var PreferenceStore = function() {
  if (env.name == 'test') {
    this.shouldStore = false;
  }

  this._retrievePreferences();
}

var TimeType = {
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
  authTokens: null,
  shouldStore: true,

  /**
   * Add an alias for a group ID so that it can be reported as a human-readable
   * name.
   *
   * @param aGroupId The id of the group to alias
   * @param aGroupAlias The alias to replace the group id with.
   */
  addGroupAlias: function(aGroupId, aGroupAlias) {
    if (!this.groupAliases) {
      this.groupAliases = {};
    }

    this._verifyExtensibility("groupAliases");

    this.groupAliases[aGroupId] = aGroupAlias;
    this._putPreferences();
  },

  /**
   * Add a time preference to the preference store.
   *
   * @param aType The type to add. Must be one of TimeType available options.
   * @param aTimePeriod The time value to add to the preference store. If not
   *        >= 0, then will be set to 0.
   */
  addTimePreference: function(aType, aTimePeriod) {
    if (!this.time) {
      this.time = {};
    }

    if (aTimePeriod < 0) {
      console.log("Unable to set a time preference value < 0. Resetting time to 0.");
      aTimePeriod = 0;
    }

    var priorStart = this.time[TimeType.PRIOR_TO_START];
    var gameLength = this.time[TimeType.LENGTH_OF_GAME];
    var consecThreshold = this.time[TimeType.CONSECUTIVE_GAME_THRESHOLD];

    switch(aType) {
      case TimeType.PRIOR_TO_START:
        priorStart = aTimePeriod;
        break;

      case TimeType.LENGTH_OF_GAME:
        gameLength = aTimePeriod;
        break;

      case TimeType.CONSECUTIVE_GAME_THRESHOLD:
        consecThreshold = aTimePeriod;
        break;

      default:
        throw "Unable to determine type for '" + aType + "'";
    }

    this.time = {
      [TimeType.PRIOR_TO_START]: priorStart,
      [TimeType.LENGTH_OF_GAME]: gameLength,
      [TimeType.CONSECUTIVE_GAME_THRESHOLD]: consecThreshold
    };

    this._putPreferences();
  },

  addLocationPreference: function(aPlace) {
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
   * @param aTimeType The time of time preference to retrieve. Must be one of the
   *        types specified in TimeType.
   * @param aDefault The default time (in minutes) to specify if one has not been
   *        added to the preference store.
   *
   * @return A numeric value indicating the number of minutes specified for the
   *         given time preference.
   */
  getTimePreference: function(aTimeType, aDefault) {
    if (this.time && this.time[aTimeType]) {
      return parseInt(this.time[aTimeType], 10);
    }

    return aDefault;
  },

  getLocationPreference: function(aLocationKey) {
      if (this.locations && this.locations[aLocationKey]) {
        var genericLoc = this.locations[aLocationKey];
        return new Place(genericLoc.mShortName, genericLoc.mName,
                        genericLoc.mAddress, genericLoc.mSubLocationName);
      }

      return aLocationKey;
  },

  /**
   * Retrieve all preferences related to time currently in the preference store.
   *
   * @return An object with members corresponding to time preferences as defined
   *         in TimeType, if they exist in the local storage; an empty object,
   *         otherwise.
   */
  getAllTimePreferences: function() {
    if (this.time) {
      return Object.freeze(this.time);
    }

    return new Object();
  },

  getAllLocationPreferences: function() {
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
  getAllGroupAliases: function() {
      if (this.groupAliases) {
        return Object.freeze(this.groupAliases);
      }

      return new Object();
  },

  /**
   * Retrieve an alias for a group, based on an ID submitted.
   */
  getAliasForGroupId: function(aGroupId) {
    if (this.groupAliases) {
      var actualName = this.groupAliases[aGroupId];
      if (actualName) {
        return actualName;
      }
    }

    // Once it's been seen, we should add it to the preference store.
    this.addGroupAlias(aGroupId, aGroupId);

    return aGroupId;
  },

  /**
   * Determine if there are aliased groups in local storage.
   *
   * @return true, if there is at least one group id with an alias;
   *         false, otherwise
   */
  hasAliasedGroups: function() {
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
  hasTimePreferences: function() {
    if (this.time) {
      for (var prop in this.time) {
        if (this.time.hasOwnProperty(prop)) {
          return true;
        }
      }
    }

    return false;
  },

  hasLocationPreference: function(aPreferenceKey) {
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
   * @param aTimeType The type of time preference to remove. Must be one of the
   *        values specified in TimeType.
   */
  removeTimePreference: function(aTimeType) {
    if (this.time) {
      delete this.time[aTimeType];
    }

    this._putPreferences();
  },

  removeLocationPreference: function(aLocationKey) {
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
  removeGroupAlias: function(aGroupId) {
    this._verifyExtensibility("groupAliases");
    
    if (this.groupAliases) {
      delete this.groupAliases[aGroupId];
    }

    this._putPreferences();
  },

  setUserId: function(aUserId) {
    this.userId = aUserId;

    this._putPreferences();
  },

  removeUserId: function() {
    delete this.userId;
    this._putPreferences();
  },

  getUserId: function() {
    return this.userId;
  },

  /**
   * Remove all previously created group aliases from the preference store.
   */
  removeAllGroupAliases: function() {
    this.groupAliases = new Object();
    this._putPreferences();
  },

  setAuthTokens: function(aAuthTokens) {
    this.authTokens = aAuthTokens;
    this._putPreferences();
  },

  getAuthTokens: function() {
    return this.authTokens;
  },

  /**
   * Put all preferences into local storage to be saved for a later date.
   */
  _putPreferences: function() {
    if (this.shouldStore) {
      var storedPrefs = jetpack.cwd(this._getUserHome())
                               .dir(".arbitrator")
                               .write("userConfig.json", this);
     }
  },

  /**
   * Retrieve preferences from local storage and populate this object with the
   * data from the store.
   */
  _retrievePreferences: function() {
    var storedPrefs = jetpack.cwd(this._getUserHome())
                             .read(".arbitrator/userConfig.json", 'json');
    if (this.shouldStore && storedPrefs) {
      this.groupAliases = storedPrefs.groupAliases;
      this.time = storedPrefs.time;
      this.locations = storedPrefs.locations;
      this.userId = storedPrefs.userId;
      this.authTokens = storedPrefs.authTokens;
    }
  },

  _getUserHome: function() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  },

  _verifyExtensibility: function(aProperty) {
    if (!Object.isExtensible(this[aProperty])) {
      // Make a copy of the object, because somewhere along the line, it became
      // non-extensible. :(
      var newObj = {};
      for (var x in this[aProperty]) {
        newObj[x] = this[aProperty][x];
      }

      this[aProperty] = newObj;
    }

  }
};

var PreferenceSingleton = {};

Object.defineProperty(PreferenceSingleton, "instance", {
  get: function() {
    if (!global[PREFERENCE_STORE_KEY]) {
      global[PREFERENCE_STORE_KEY] = new PreferenceStore();
    }

    return global[PREFERENCE_STORE_KEY];
  }
});

Object.freeze(PreferenceSingleton);

var gameLevels = {
  'Mite'            : 'Mite',
  'Squirt'          : 'Squirt',
  'Peewee'          : 'Peewee',
  'Bantam'          : 'Bantam',
  'Junior Gold'     : 'Junior Gold',
  'Junior'          : 'Junior',
  'SC'              : 'Squirt C',
  'SB'              : 'Squirt B',
  'SA'              : 'Squirt A/AA/AAA',
  'PC'              : 'Peewee C',
  'PB'              : 'Peewee B',
  'PA'              : 'Peewee A/AA/AAA',
  'BC'              : 'Bantam C',
  'BB'              : 'Bantam B',
  'BA'              : 'Bantam A/AA/AAA',
  'JGB'             : 'Junior Gold B',
  'JGA'             : 'Junior Gold A/AA/AAA',
  '10U'             : '10U Girls',
  '10A'             : '10U Girls A',
  '10B'             : '10U Girls B',
  '12U'             : '12U Girls',
  '12A'             : '12U Girls A',
  '12B'             : '12U Girls B',
  '14U'             : '14U Girls',
  '16U'             : '16U Girls',
  '19U'             : '19U Girls',
  'Boys, Varsity'   : 'Varsity Boys',
  'Girls, Varsity'  : 'Varsity Girls',
  'Boys, JV'        : 'Junior Varsity Boys',
  'Girls, JV'       : 'Junior Varsity Girls'
};

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

var Game = function (aId, aGroup, aRole, aTimestamp, aSportLevel, aSite,
                            aHomeTeam, aAwayTeam, aFees) {
  var prefStore = PreferenceSingleton.instance;
  this.mId = aId;
  this.mGroup = prefStore.getAliasForGroupId(aGroup);
  this.setRole(aRole);
  this.mTimestamp = aTimestamp;
  this.mSportLevel = aSportLevel;
  this.mSite = this.getPlaceForSite(aSite);
  this.mHomeTeam = aHomeTeam;
  this.mAwayTeam = aAwayTeam;
  this.mFees = aFees;
  this.mIsConsecutiveGame = false;
}

Game.prototype = {
  getId: function() {
    return this.mId;
  },

  getGroup: function() {
    return this.mGroup;
  },

  getSportLevel: function() {
    return this.mSportLevel;
  },

  getSite: function() {
    return this.mSite;
  },

  getHomeTeam: function() {
    return this.mHomeTeam;
  },

  getAwayTeam: function() {
    return this.mAwayTeam;
  },

  getFees: function() {
    return this.mFees;
  },

  getTimestampAsString: function() {
    // Retrieves the arbiter-printed string, which currently has the format:
    // MM/DD/YYYY h:MM A
    var components = this.mTimestamp.split(" ");
    return components[0] + " " + components[2] +  " " + components[3];
  },

  /**
   * Retrieve the moment for which this game starts.
   *
   * @return {Moment} A Moment.js moment for which this game is set to start,
   *                  based on the data from ArbiterSports.
   */
  getTimestamp: function() {
    return moment(this.getTimestampAsString(), "MM/DD/YYYY h:mm a");
  },

  getTime12Hr: function() {
    return this.getTimestamp().format("h:mma");
  },

  getISOStartDate: function() {
    var prefStore = PreferenceSingleton.instance;
    var startDate = this.getTimestamp();
    var priorToStart = prefStore.getTimePreference(TimeType.PRIOR_TO_START, 30);
    if (this.isConsecutiveGame()) {
      priorToStart = 0;
    }

    return startDate.subtract(priorToStart, 'minutes').toISOString();
  },

  getISOEndDate: function() {
    var prefStore = PreferenceSingleton.instance;
    var endDate = this.getTimestamp();

    // Default to 1 hour if no time preference is specified.
    var gameLengthMins = prefStore.getTimePreference(TimeType.LENGTH_OF_GAME, 60);
    return endDate.add(gameLengthMins, 'minutes').toISOString();
  },

  /**
   * Determines if this game is a consecutive game (a game where the preceding
   * game is at the same site and ended within two hours of the start of this
   * game).
   *
   * @return true, if this game is a consecutive game; false, otherwise.
   */
  isConsecutiveGame: function() {
    return this.mIsConsecutiveGame;
  },

  /**
   * Set whether or not this game is a consecutive game (a game where the
   * preceding game is at the same site and ended within two hours of the start
   * of this game).
   *
   * @param aIsConsecutive Whether or not this is a consecutive game
   */
  setConsecutiveGame: function(aIsConsecutive) {
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
  isWithinConsecutiveTimeRangeOf: function(aGame) {
    var prefStore = PreferenceSingleton.instance;
    var consecutiveGameThreshold = prefStore.getTimePreference(TimeType.CONSECUTIVE_GAME_THRESHOLD, 2);
    var aOtherTimestamp = aGame.getTimestamp();
    var timeStamp = this.getTimestamp();
    return aOtherTimestamp.date() == timeStamp.date()
           && aOtherTimestamp.year() == timeStamp.year()
           && aOtherTimestamp.month() == timeStamp.month()
           && aOtherTimestamp.hours() + consecutiveGameThreshold >= timeStamp.hours()
  },

  setRole: function(aRoleString) {
    // Role is column 3, and can be either "Referee" or "Linesman".
    if (aRoleString.search(/referee/i) != -1) {
      this.mRole = Role.REFEREE;
    } else if (aRoleString.search(/linesman/i) != -1) {
      this.mRole = Role.LINESMAN;
    } else {
      this.mRole = Role.UNKNOWN;
    }
  },

  isTeamValid: function(aTeamName) {
    switch(aTeamName) {
      case 'TBD':
        return false;
      case 'TBA':
        return false;
      default:
        return true;
    }
  },

  getLevel: function() {
    // See hashmap of levels at the top of the file.
    // TODO: Add a better algorithm for this.

    var levelString = this.getSportLevel();
    var levelKeys = Object.keys(gameLevels);
    for (var level in levelKeys) {
      if (levelString.indexOf(levelKeys[level]) > 0) {
        return gameLevels[levelKeys[level]];
      }
    }

    // Check for a year
    var yearStringIdx = levelString.search(/([0-9]{4})/g);
    var yearString = levelString.slice(yearStringIdx, yearStringIdx+4);

    if (yearString) {
        var currentYear = (new Date()).getFullYear();
        var age = parseInt(currentYear,10) - yearString;
        if (age <= 8) {
          return 'Mite';
        } else if (age > 8 && age <= 10) {
          return 'Squirt';
        } else if (age > 10 && age <= 12) {
          return 'Peewee';
        } else if (age > 12 && age <= 14) {
          return 'Bantam';
        } else if (age > 14 && age <= 16) {
          return '16U Boys/Girls';
        } else if (age > 16 && age <= 18) {
          return 'Junior Gold';
        } else if (age > 18 && age <= 20) {
          return 'Junior';
        } else if (age > 20){
          return 'Senior Mens/Womens';
        }
    }

    // TODO: Add analytics so that we can determine what the unknown was.
    return "UNKNOWN";
  },

  areTeamsValid: function() {
    return this.isTeamValid(this.mHomeTeam) && this.isTeamValid(this.mAwayTeam);
  },

  getSummaryString: function() {
    var summaryString = "";
    if (this.getGroup() != "NONE") {
      summaryString = summaryString + "[" + this.getGroup() + "] ";
    }

    var role = this.getRole();
    if (role == Role.REFEREE) {
      summaryString = summaryString + "Referee ";
    } else if (role == Role.LINESMAN) {
      summaryString = summaryString + "Linesman ";
    } else {
      summaryString = summaryString + "Officiate ";
    }

   if (this.isScrimmage()) {
      summaryString = summaryString + "Scrimmage ";
   }

   if (this.areTeamsValid()) {
      summaryString = summaryString + this.mHomeTeam + " v " + this.mAwayTeam + " ";
   }

   var level = this.getLevel();
   if (level != 'UNKNOWN') {
     summaryString = summaryString + "(" + level + (this.isTournament() ? " Tournament" : "") + ")";
   }

   return summaryString.trim();
  },

  getRole: function() {
    return this.mRole;
  },

  getEventJSON: function() {
    var siteData = this.getSite().getAddress() ? this.getSite().getAddress() : this.getSite().getName();
    var subLocationString = this.getSite().hasSubLocation() ? "\n\nRink " + this.getSite().getSubLocationName() : "";
    return  {
      "end": {
        "dateTime": this.getISOEndDate()
      },
      "start": {
        "dateTime": this.getISOStartDate()
      },
      "location": siteData,
      "description": "Game starts at " + String(this.getTime12Hr())
                     + subLocationString
                     + "\n\n{ArbitratorHash: " + String(this.getHash()) + "}",
      "summary": this.getSummaryString()
    };
  },

  isScrimmage: function() {
    return this.getSportLevel().search(/scrimmage/i) != -1;
  },

  isTournament: function() {
    return this.getSportLevel().search(/tournament/i) != -1;
  },

  /**
   * Retrieve an identification string for this game. Essentially, this is
   * just a concatenation of the game id, the group, teams playing, and level.
   *
   * @return A string that is an identifier for this game. This identifier should
   *         not change, even if the game dates/times change.
   */
   getIdentificationString: function() {
      // var level = this.getLevel() === "UNKNOWN" ? "" : this.getLevel();
      // var teams = this.areTeamsValid() ? this.getHomeTeam() + "v" + this.getAwayTeam() : "";
      var idString = String(this.getId());
      // idString = idString + this.getGroup() + level + teams;

      return idString.replace(/\s+/gm, "");
   },

  /**
   * Retrieve a hash of the unique identifying information of this game. This
   * serves to identify the game if the date/time changes.
   *
   * @return A string of a SHA-1 hash of the game id.
   */
  getHash: function() {
    return CryptoJS.SHA1(this.getIdentificationString()).toString(CryptoJS.enc.Hex);
  },


  /**
   * Retrieve a Place object for some existing site string.
   *
   * @param aSiteName The textual name of the site, as passed in from ArbiterSports.
   *
   * @returns A Place object with name equivalent to aSiteName, but with an address
   *          if one was found in the preference store.
   */
  getPlaceForSite: function(aSiteName) {
    // Convert the site name to a key
    var placeKey = aSiteName.replace(/\s/g, '');

    var prefStore = PreferenceSingleton.instance;
    if (prefStore.hasLocationPreference(placeKey)) {
      return prefStore.getLocationPreference(placeKey);
    }

    var place = new Place(placeKey, aSiteName, undefined, "");
    prefStore.addLocationPreference(place);
    return place;
  }
}

// Specify default options to be used with all requests.
// google.options({ proxy: 'http://localhost:5555' });

/**
 * Create a new instance of an ArbitratorGoogleClient object for use with Arbitrator.
 *
 * @param aOptionalCallback (Optional) A callback to be called when the
 *        ArbitratorGoogleClient has finished its initialization.
 */
var ArbitratorGoogleClient = function() {
}

ArbitratorGoogleClient.prototype = {
  client: null,

  getClient: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      var prefStore = PreferenceSingleton.instance;
      var OAuth2 = google.auth.OAuth2;
      that.client = new OAuth2(
        ArbitratorConfig.google_client_id,
        ArbitratorConfig.google_client_secret,
        'urn:ietf:wg:oauth:2.0:oob' // Instruct google to return the auth code via the title
      );

      var tokens = prefStore.getAuthTokens();
      if (tokens) {
        that.client.setCredentials(tokens);
        resolve(that.client);
      } else {
        var scopes = [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/userinfo.profile'
        ];

        var url = that.client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: 'offline',
          scope: scopes
        });

        var window = createWindow('googleAuth', {width: 400, height:650});
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
                  var prefStore = PreferenceSingleton.instance;
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

  getCalendarList: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      var cal = google.calendar({
        version: 'v3',
        auth: that.client
      });

      cal.calendarList.list(null, null,
        function (err, result) {
          if (err) {
            reject(err);
          }

          resolve(result.items);
      });
    });
  },

  getUserId: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      var plus = google.plus({version: 'v1', auth: that.client});
      plus.people.get({'userId': 'me'}, function(err, result) {
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
  adjustGameInCalendar: function(aCalendarId, aEvent, aGame) {
    console.log("Adjusting game in calendar...");
    var that = this;
    return new Promise((resolve, reject) => {
      that.getToken(() => {
        var cal = google.calendar({
          version: 'v3',
          auth: that.client
        });

        // First, delete the old event.
        cal.events.delete({
          'calendarId' : aCalendarId,
          'eventId' : aEvent.id
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
  submitGameToCalendar: function(aCalendarId, aGame) {
    var that = this;
    return new Promise((resolve, reject) => {
      that.getClient().then((client) => {
        var eventToInsert = aGame.getEventJSON();

        var cal = google.calendar({
          version: 'v3',
          auth: client
        });

        cal.events.insert({
          'calendarId' : aCalendarId,
          'resource' : eventToInsert
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
  findGameInCalendar: function(aCalendarId, aGame) {
    return new Promise((resolve, reject) => {
      var that = this;
      that.getClient().then((oAuthClient) => {
        console.log("CLIENT:");
        console.log(oAuthClient);
        var cal = google.calendar({
          version: 'v3',
          auth: oAuthClient
        });

        console.log("Searching for game with hash: " + aGame.getHash());
        var searchString = "{ArbitratorHash: " + aGame.getHash() + "}";
        var req = cal.events.list({
          'calendarId' : aCalendarId
        }, {}, function (err, result) {
          if (err) {
            reject(err);
            return;
          }

          var results = result.items;
          var foundEvent = false;
          for (var i = 0; i < results.length; i++) {
            var calEvent = results[i];
            if (calEvent.description
                && calEvent.description.indexOf(searchString) > 0) {
                resolve(calEvent);
                return;
            }
          }

          if (!foundEvent) {
            resolve();
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
};

var StringUtils = {
  capitalize: function(aString) {
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
var EventSearchObserver = function(aMatchFunction, aNoMatchFunction) {
  this.onMatchFound = aMatchFunction;
  this.onNoMatchFound = aNoMatchFunction;
}

var Arbitrator = function(aString) {
  this.mBaseString = aString;
  this.mGames = {};
  this.numGames = 0;
  this.parseFromText();
  this.mUiManager = new UIManager();
  this.mGoogleClient = new ArbitratorGoogleClient();
}

Arbitrator.prototype = {
  parseFromText: function() {
    this.mBaseString = this.mBaseString.replace(/Accepted\ on\ [0-9]+\/[0-9]+\/([0-9]{4})/g, '')
    var cols = this.mBaseString.split(/[\t\n]+/);
    this.mTable = new Array();
    var row = new Array();
    var columnPointer = 0;
    var removedLastCol= false;
    for (var col in cols) {
      // col is our GLOBAL column pointer - the index of the current column in
      // the whole set of all columns. columnPointer is the relative colum
      // pointer - the index of the column in the current row.
      var trimmedCol = cols[col].trim();
      if (trimmedCol.length != 0) {
        var oldLength = row.length;
        var newLength = row.push(trimmedCol);

      } else if (columnPointer == 1){
        row.push("NONE");
      }

      // Special date handling, in the event that we actually have a newline in
      // between where the date is and where the time is (this happens occasionally)
      if (columnPointer == 4
          && (row[columnPointer].endsWith("PM")
              || row[columnPointer].endsWith("AM"))) {
        row[columnPointer-1] = row[columnPointer-1] + " " + row[columnPointer];
        row.pop();
        columnPointer = columnPointer - 1;
      }

      columnPointer = columnPointer + 1;
      if (columnPointer == 9) {
        this.mTable.push(row);
        var gm = new Game(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
        row = new Array();
        this.mGames[gm.getId()] = gm;
        this.numGames++;
        columnPointer = 0;
      }
    }

    this.findConsecutiveGames();
  },

  getNumGames: function() {
    return this.numGames;
  },

  getGameById: function(aId) {
    if (this.mGames[aId]) {
      return this.mGames[aId];
    }

    return null;
  },

  getRows: function() {
    return this.mTable;
  },

  getColumns: function(aRow) {
    return this.mTable[aRow];
  },

  getDescription: function(aRow) {
    // Game description is column 5
    return this.mTable[aRow][5];
  },

  /**
   * @returns 0, if the row is a referee assignment; 1, if the row is a linesman
   *          assignment; -1 otherwise.
   */
  getRole: function(aGameId) {
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
  adjustGamesOrSubmitToCalendar: function(aCalendarId) {
    // Save this pointer so it can be used in the callback.
    var self = this;
    var numGames = Object.keys(this.mGames).length;
    var gamesProcessed = 0;
    var callback = new EventSearchObserver(
      function(aGame, aCalendarEvent) {
        self.mGoogleClient.adjustGameInCalendar(aCalendarId, aCalendarEvent, aGame)
          .then(() => {
            gamesProcessed++;
            if (gamesProcessed == numGames) {
              self.mUiManager.showSnackbar('Game(s) added to calendar');
            }
          });
      },

      function(aGame) {
        console.log("Saw no match");
      });

    for (var key in this.mGames) {
      if (this.mGames.hasOwnProperty(key)) {
        var game = this.mGames[key];
        // self.mGoogleClient.findGameInCalendar(aCalendarId, game)
          // .then((foundEventId) => {
            // if (!foundEventId) {
              // var googleClient = new ArbitratorGoogleClient();
              self.mGoogleClient.submitGameToCalendar(aCalendarId, game)
                .then(() => {
                  gamesProcessed++;
                  if (gamesProcessed == numGames) {
                    self.mUiManager.showSnackbar('Game(s) added to calendar');
                  }
              });
            // } else {
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
  getAllGames: function() {
    return this.mGames;
  },

//   /**
//    * Search through all games to find those that are consecutive.
//    *
//    * Note that this does not currently search through calendar history. That is,
//    * only games that are entered together in the same Arbitrator object are
//    * under consideration for being linked in a consecutive manner.
//    */
  findConsecutiveGames: function() {
    var prefStore = PreferenceSingleton.instance;
    var gameLengthMins = prefStore.getTimePreference(TimeType.LENGTH_OF_GAME, 60);
    var prevGame;
    for (var index in this.mGames) {
      var curGame = this.mGames[index];
      if (prevGame
          && curGame.isWithinConsecutiveTimeRangeOf(prevGame)
          && curGame.getSite().getName() == prevGame.getSite().getName()) {
          curGame.setConsecutiveGame(true);
        }

        prevGame = curGame;
      }
  }
}

var UIManager = function() {
}

UIManager.prototype = {
  mGoogleClient: null,
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
    console.log("Arbitrating: " + scheduleText);
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
    var prefStore = PreferenceSingleton.instance;
    this.refreshTimePreferences();
    this.refreshAliasPreferences();
    this.refreshLocationPreferences();

    this._setPreferenceOnClickHandlers();
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
    var prefName = '';
    var prefStore = PreferenceSingleton.instance;
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
    $.get('partials/alias-preference.partial.html', function(data) {
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
      that._setAliasPreferenceOnClickHandlers();
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

  setLocationPreference: function(aLocationPrefKey, aLocationPrefName) {
    var address = $('#locationAddressPref-' + aLocationPrefKey).val();
    var subLocationName = $('#locationSubLocationPref-' + aLocationPrefKey).val();

    var prefName = '';
    var prefStore = PreferenceSingleton.instance;
    prefStore.addLocationPreference(new Place(aLocationPrefKey, aLocationPrefName, address, subLocationName));

    this.showSnackbar("Address for '" + aLocationPrefName + "' set");
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
    var that = this;
    $.get('partials/location-preference.partial.html', function(data) {
      var dataElement = $(data);
      var addressTextInputId = 'locationAddressPref-' + aPlace.getShortName();
      var subLocationTextInputId = 'locationSubLocationPref-' + aPlace.getShortName();
      var addressPlaceholderText = 'Enter address for ' + aPlace.getName();
      if (aPlace.getAddress()) {
        addressPlaceholderText = aPlace.getAddress();
      }

      var subLocationPlaceholderText = '';
      if (aPlace.hasSubLocation()) {
        subLocationPlaceholderText = aPlace.getSubLocationName();
      }

      dataElement.find('label').attr('for', addressTextInputId).text(aPlace.getName());
      dataElement.find('.locationTextInput').attr('id', addressTextInputId)
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

      // Since this method is run every time preferences are refreshed, and in
      // order to generalize the loadContent() method a bit we refresh all
      // preferences on every content load, this should only be called if there
      // actually _is_ a location preference input element in the DOM.
      if (addressElement) {
        // locService.enableAutoCompleteForElement(addressElement);
        that._setLocationPreferenceOnClickHandlers();
      }
    });
  },

  // logout: function() {
  //   var prefStore = PreferenceSingleton.instance;
  //   prefStore.removeUserId();
  //   location.reload();
  // },

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
    var prefStore = PreferenceSingleton.instance;

    $('button.setAlias').each(function() {
      $(this).off('click');
      $(this).click(function() {
        var actualName = $(this).parent().find('.originalName').data('actualname');
        var aliasName = $(this).parent().find('.aliasName').val();
        that.addAliasToPrefStore(actualName, aliasName);
      });
    });

    $('.aliasRemoveButton').each(function() {
      $(this).off('click');
      $(this).click(function() {
        that.deleteAliasPreference($(this).data('actualname'));
        $(this).parent().fadeOut(300, function () {
          $(this).remove();
        });
      });
    });

    $('#aliasAddButton').off('click');
    $('#aliasAddButton').click(function() {
      var actualName = $('#aliasAddName').text();
      var aliasName = $('#aliasAddAlias').text();

      that.addAliasToPrefStore(actualName, aliasName);

      $('#aliasAddName').text('');
      $('#aliasAddAlias').text('');

      that.refreshAliasPreferences();
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
   *        correspond to a file in the partials/ subdirectory called
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

    if (aContentFileName == 'main') {
      that.refreshGoogleClient(function(aGoogleClient) {
        that.populateCalendarList(aGoogleClient);
        that.populateUserId(aGoogleClient);
      });
    }

    $('main#content').load('partials/' + aContentFileName + '.partial.html', null,
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

                             // Add the version number to the app bar
                             $('#versionNumber').text('v' + ArbitratorConfig.version_number);

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

// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
// import os from 'os'; // native node.js module
// import { remote } from 'electron'; // native electron module
// import jetpack from 'fs-jetpack'; // module loaded from npm
// import { greet } from './hello_world/hello_world'; // code authored by you in this project
// import env from './env';

// console.log('Loaded environment variables:', env);

// var app = remote.app;
// var appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
// console.log('The author of this app is:', appDir.read('package.json', 'json').author);
//
// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('greet').innerHTML = greet();
//     document.getElementById('platform-info').innerHTML = os.platform();
//     document.getElementById('env-name').innerHTML = env.name;
// });

electron.ipcRenderer.on('ready', (event, arg) => {
  var manager = new UIManager();
  manager.loadContent('main', 'Arbitrator', function() {
    manager.refreshPreferences();
    manager.setUIListeners();
  });
});
}());
//# sourceMappingURL=app.js.map