/**
 * Constants that id the time preferences.
 */
var TimeType = Object.freeze({
  /**
  * Flag for indicating the time type is prior to the game start.
  */
  PRIOR_TO_START: 'priorToStart',

  /**
  * Flag for indicating the time type is after the game start until the game
  * ends (i.e. the length of the game).
  */
  LENGTH_OF_GAME: 'gameLength'
});

/**
 * An object connected to local storage for persistent storage of setting
 * data.
 */
var PreferenceStore = function() {
  this._retrievePreferences();
}

PreferenceStore.prototype = {
  /**
   * Add an alias for a group ID so that it can be reported as a human-readable
   * name.
   *
   * @param aGroupId The id of the group to alias
   * @param aGroupAlias The alias to replace the group id with.
   */
  addGroupAlias: function(aGroupId, aGroupAlias) {
    if (!this.groupAliases) {
      this.groupAliases = new Object();
    }

    this.groupAliases[aGroupId] = aGroupAlias;
    this._putPreferences();
  },

  /**
   * Add a time preference to the preference store.
   *
   * @param aType The type to add. Must be one of TimeType available options.
   * @param aTimeInMinutes The time value, in minutes, to add to the preference
   *        store. If not >= 0, then will be set to 0.
   */
  addTimePreference: function(aType, aTimeInMinutes) {
    if (!this.time) {
      this.time = new Object();
    }

    if (aTimeInMinutes < 0) {
      console.log("Unable to set a time preference value < 0. Resetting time to 0.");
      aTimeInMinutes = 0;
    }

    switch(aType) {
      case TimeType.PRIOR_TO_START:
        this.time[TimeType.PRIOR_TO_START] = aTimeInMinutes;
        break;

      case TimeType.LENGTH_OF_GAME:
        this.time[TimeType.LENGTH_OF_GAME] = aTimeInMinutes;
        break;

      default:
        throw "Unable to determine type for '" + aType + "'";
    }

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

  /**
   * Remove a previously created alias for a group ID.
   *
   * @param The group id for which the previously-created alias should be
   *         removed.
   */
  removeGroupAlias: function(aGroupId) {
    if (this.groupAliases) {
      delete this.groupAliases[aGroupId];
    }

    this._putPreferences();
  },

  /**
   * Put all preferences into local storage to be saved for a later date.
   */
  _putPreferences: function() {
    window.localStorage['arbitrator'] = JSON.stringify(this);
  },

  /**
   * Retrieve preferences from local storage and populate this object with the
   * data from the store.
   */
  _retrievePreferences: function() {
    var preferenceString = window.localStorage['arbitrator'];
    if (preferenceString) {
      var prefObj = JSON.parse(preferenceString);
      this.groupAliases = prefObj['groupAliases'];
      this.time = prefObj['time'];
    }
  }
};
