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
  },

  hasNonAliasedGroups: function() {
    for (var key in this.mGames) {
      if (this.mGames.hasOwnProperty(key)) {
        if (this.mGames[key].hasNonAliasedGroup()) {
          return true;
        }
      }
    }

    return false;
  }
}

// Static methods

/**
 * Add an alias for a group ID so that it can be reported as a human-readable
 * name.
 *
 * @param aGroupId The id of the group to alias
 * @param aGroupAlias The alias to replace the group id with.
 */
Arbitrator.addGroupAlias = function(aGroupId, aGroupAlias) {
  console.log("Adding alias for " + aGroupId + " -> " + aGroupAlias);
  window.localStorage[Arbitrator.PREFERENCE_GROUP_ALIAS + aGroupId] = aGroupAlias;
},

/**
 * Retrieve an alias for a group, based on an ID submitted.
 */
Arbitrator.getAliasForGroupId = function(aGroupId) {
  var actualName = window.localStorage[Arbitrator.PREFERENCE_GROUP_ALIAS + aGroupId];
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
    delete window.localStorage[Arbitrator.PREFERENCE_GROUP_ALIAS + aGroupId];
}
