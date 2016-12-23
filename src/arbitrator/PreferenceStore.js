import { Place } from './Place';
import * as fs from 'fs';
import * as path from 'path';
import jetpack from 'fs-jetpack';
import env from '../env';
import { GameAgeProfile, GameAgeLevel } from './GameAgeProfile';

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

export var TimeType = {
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
   * Add a new {GameAgeProfile} to the preference store.
   *
   * @param {GameAgeProfile} aGameAgeProfile The profile to add to the
   *        preference store.
   */
  addGameAgeProfile: function(aGameAgeProfile) {
    if (!this.gameAgeProfiles) {
      this.gameAgeProfiles = [];
    }

    this.gameAgeProfiles.push(aGameAgeProfile);
    this._putPreferences();
  },

  /**
   * Set an existing {GameAgeProfile} to a new value.
   *
   * This will search, by profileId, for an existing {GameAgeProfile} within
   * the preference store. If one is found, it will be removed and replaced with
   * the given parameter. If one is not found, then the given parameter will be
   * added to the preference store as if addGameAgeProfile() was called.
   *
   * @param {GameAgeProfile} aGameAgeProfile The new profile to place into the
   *        preference store.
   */
  setGameAgeProfile: function(aGameAgeProfile) {
    for (var idx in this.gameAgeProfiles) {
      var nextProfile = this.gameAgeProfiles[idx];
      if (nextProfile.getProfileId() == aGameAgeProfile.getProfileId()) {
        delete this.gameAgeProfiles[idx];
        break;
      }
    }

    this.addGameAgeProfile(aGameAgeProfile);
  },

  /**
   * Add a {GameAgeLevelSetting} to a {GameAgeProfile} and store it in the
   * preference store.
   *
   * @param {string} aProfileName The profileId of the {GameAgeProfile} to add
   *                              the new setting to.
   * @param {string} aRegex       The regular expression defining the new
   *                              {GameAgeLevelSetting}.
   * @param {string} aAge         The age descriptor of the new
   *                              {GameAgeLevelSetting}.
   * @param {string} aLevel       The level descriptor of the new
   *                              {GameAgeLevelSetting}.
   */
  addGameAgeLevelSetting: function(aProfileName, aRegex, aAge, aLevel) {
    var self = this;

    var setting = new GameAgeLevel(aRegex, aAge, aLevel);
    var gameAgeProfile = self.getGameAgeProfile(aProfileName);
    if (!gameAgeProfile) {
      gameAgeProfile = new GameAgeProfile(aProfileName);
    }

    gameAgeProfile.addGameAgeLevel(setting);
    self.setGameAgeProfile(gameAgeProfile);
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

  getAllGameAgeProfiles: function() {
    if (!this.gameAgeProfiles) {
      this.gameAgeProfiles = [];
    }

    return this.gameAgeProfiles;
  },

  getGameAgeProfile: function(aProfileId) {
    var gameAgeProfiles = this.getAllGameAgeProfiles();
    for (var idx in gameAgeProfiles) {
      let nextProfile = gameAgeProfiles[idx];
      if (nextProfile.getProfileId() == aProfileId) {
        return nextProfile;
      }
    }

    return null;
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
   * Store preferences to a configuration file in the user's home directory so
   * they can be read back in at a later date.
   */
  _putPreferences: function() {
    if (this.shouldStore) {
      var storedPrefs = jetpack.cwd(this._getUserHome())
                               .dir(".arbitrator")
                               .write("userConfig.json", this);
     }
  },

  /**
   * Export this {PreferenceStore} to a string. This is useful for debugging the
   * storage methods.
   *
   * @return {string} The JSON of this object, in string form.
   */
  toString: function() {
    return JSON.stringify(this);
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
      this.gameAgeProfiles =
        this._deserializeGameProfiles(storedPrefs.gameAgeProfiles);
    }
  },

  // TODO: We should separate this into a module that allows for more general
  //       deserialization.
  _deserializeGameProfiles: function(aBaseObject) {
    var profiles = [];
    for (var idx in aBaseObject) {
      profiles.push(this._deserializeSingleGameProfile(aBaseObject[idx]));
    }

    return profiles;
  },

  _deserializeSingleGameProfile: function(aBaseObject) {
    var profile = new GameAgeProfile(aBaseObject.mProfileId);
    for (var idx in aBaseObject.mGameAgeLevels) {
      var nextGameAgeLevel = aBaseObject.mGameAgeLevels[idx];
      profile.addGameAgeLevel(new GameAgeLevel(nextGameAgeLevel.mRegEx,
                                               nextGameAgeLevel.mAge,
                                               nextGameAgeLevel.mLevel));
    }
    return profile;
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

export var PreferenceSingleton = {};

Object.defineProperty(PreferenceSingleton, "instance", {
  get: function() {
    if (!global[PREFERENCE_STORE_KEY]) {
      global[PREFERENCE_STORE_KEY] = new PreferenceStore();
    }

    return global[PREFERENCE_STORE_KEY];
  }
});

Object.freeze(PreferenceSingleton);
