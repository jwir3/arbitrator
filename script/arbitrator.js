// Identifiers for whether we want to use start time or length of game
// when setting time preferences.
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

var Arbitrator = function(aString) {
  this.mBaseString = aString;
  this.mGames = {};
  this.numGames = 0;
  this.parseFromText();
}

Arbitrator.prototype = {
  // General preference prefix
  PREFERENCE_PREFIX: 'arbitrator.',

  // Preferences associated with group aliases
  PREFERENCE_GROUP_ALIAS: this.PREFERENCE_PREFIX + "groupAlias.",

  // Preferences associated with time
  PREFERENCE_TIME: this.PREFERENCE_PREFIX + "time.",

  parseFromText: function() {
    this.mBaseString = this.mBaseString.replace(/Accepted\ on\ [0-9]+\/[0-9]+\/([0-9]{4})/g, '')
    var cols = this.mBaseString.split(/[\t\n]+/);
    this.mTable = new Array();
    var row = new Array();
    var columnPointer = 0;
    var removedLastCol= false;
    for (col in cols) {
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
  },

  getNumGames: function() {
    return this.numGames;
  },

  getGameById: function(aId) {
    return this.mGames[aId];
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

  notifyGameAdded: function(aGame) {
    addToMessage('Game #' + aGame.getId() + ' was added to Google Calendar.');
  },

  submitGamesToCalendar: function(aCalendarId) {
    for (var key in this.mGames) {
      if (this.mGames.hasOwnProperty(key)) {
      var eventToInsert = this.mGames[key].getEventJSON();
      var request = gapi.client.calendar.events.insert({
        'calendarId' : aCalendarId,
        'resource' : eventToInsert
      });
      request.execute(function(response){
        console.log(response);
      });
      this.notifyGameAdded(this.mGames[key]);
      }
    }
  }
}

// Static methods

/**
 * Determine if there are aliased groups in local storage.
 *
 * @return true, if there is at least one group id with an alias;
 *         false, otherwise
 */
Arbitrator.hasAliasedGroups = function() {
  var groupAliases = Arbitrator.getGroupAliases();
  for (var prop in groupAliases) {
    if (groupAliases.hasOwnProperty(prop)) {
      return true;
    }
  }

  return false;
}

/**
 * Add an alias for a group ID so that it can be reported as a human-readable
 * name.
 *
 * @param aGroupId The id of the group to alias
 * @param aGroupAlias The alias to replace the group id with.
 */
Arbitrator.addGroupAlias = function(aGroupId, aGroupAlias) {
  console.log("Adding alias for " + aGroupId + " -> " + aGroupAlias);
  var groupAliases = Arbitrator.getGroupAliases();

  groupAliases[aGroupId] = aGroupAlias;
  window.localStorage[Arbitrator.PREFERENCE_GROUP_ALIAS] = JSON.stringify(groupAliases);
},

/**
 * Add a time preference to the preference store.
 *
 * @param aType The type to add. Must be one of TimeType available options.
 * @param aTimeInMinutes The time value, in minutes, to add to the preference
 *        store. If not >= 0, then will be set to 0.
 */
Arbitrator.addTimePreference = function(aType, aTimeInMinutes) {
  var timePref = new Object();
  if (aTimeInMinutes < 0) {
    console.log("Unable to set a time preference value < 0. Resetting time to 0.");
    aTimeInMinutes = 0;
  }

  switch(aType) {
    case TimeType.PRIOR_TO_START:
      timePref[TimeType.PRIOR_TO_START] = aTimeInMinutes;
      break;

    case TimeType.LENGTH_OF_GAME:
      timePref[TimeType.LENGTH_OF_GAME] = aTimeInMinutes;
      break;

    default:
      throw "Unable to determine type for '" + aType + "'";
  }

  window.localStorage[Arbitrator.PREFERENCE_TIME] = JSON.stringify(timePref);
},

/**
 * Retrieve all group aliases as an object with key/value pairs.
 *
 * @return An object with keys corresponding to group ids and values corresponding
 *         to associated group aliases.
 */
Arbitrator.getGroupAliases = function() {
  var groupAliasString = window.localStorage[Arbitrator.PREFERENCE_GROUP_ALIAS];
  if (!groupAliasString) {
      groupAliasString = '{}';
  }

  return JSON.parse(groupAliasString);
},

/**
 * Retrive all time preferences as an Object.
 *
 * @return A JSON-style object (NOT a string) with members corresponding to
 *         individual time preferences, and each member having the value of the
 *         associated time preference from local storage; an empty object if no
 *         time preferences are yet defined.
 */
Arbitrator.getTimePreferences = function() {
    var timePreferenceString = window.localStorage[Arbitrator.PREFERENCE_TIME];
    if (!timePreferenceString) {
      timePreferenceString = '{}';
    }

    return JSON.parse(timePreferenceString);
},


/**
 * Retrieve the value of a single time preference.
 *
 * @param aTimeType The time of time preference to retrieve. Must be one of the
 *        types specified in TimeType.
 *
 * @return A numeric value indicating the number of minutes specified for the
 *         given time preference.
 */
Arbitrator.getTimePreference = function(aTimeType) {
    var timePreferences = Arbitrator.getTimePreferences();
    return timePreferences[aTimeType];
},

/**
 * Retrieve an alias for a group, based on an ID submitted.
 */
Arbitrator.getAliasForGroupId = function(aGroupId) {
  var groupAliases = Arbitrator.getGroupAliases();
  var actualName = groupAliases[aGroupId];
  console.log("Group alias for '" + aGroupId + "': '" + actualName + "'")
  if (actualName) {
    addAliasUIFor(aGroupId, actualName);
    return actualName;
  }

  addAliasUIFor(aGroupId, aGroupId);
  return aGroupId;
},

/**
 * Remove a previously created alias for a group ID.
 *
 * @param The group id for which the previously-created alias should be
 *         removed.
 */
Arbitrator.removeGroupAlias = function(aGroupId) {
  var groupAliases = Arbitrator.getGroupAliases();
  if (groupAliases) {
    delete groupAliases[aGroupId];
  }

  window.localStorage[Arbitrator.PREFERENCE_GROUP_ALIAS] = JSON.stringify(groupAliases);
},

/**
 * Remove the instance of a single time preference from the preference store.
 *
 * @param aTimeType The type of time preference to remove. Must be one of the
 *        values specified in TimeType.
 */
Arbitrator.removeTimePreference = function(aTimeType) {
  var timePrefs = Arbitrator.getTimePreferences();
  if (timePrefs) {
    delete timePrefs[aTimeType];
  }

  window.localStorage[Arbitrator.PREFERENCE_TIME] = JSON.stringify(timePrefs);
}
