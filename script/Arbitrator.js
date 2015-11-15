module.exports = Arbitrator;

var Game = require('./Game');
var PreferenceStore = require('./PreferenceStore');
var Place = require('./Place');

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

function Arbitrator(aString) {
  this.mBaseString = aString;
  this.mGames = {};
  this.numGames = 0;
  this.parseFromText();
}

Arbitrator.prototype = {
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

    this.findConsecutiveGames();
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
    updateGroupAliasPreferenceUI();
  },

  notifyGameAdjusted: function(aGame) {
    addToMessage('Game #' + aGame.getId() + ' was adjusted in Google Calendar.');
  },

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
    var callback = new EventSearchObserver(
      function(aGame, aCalendarEvent) {
        // Do nothing for right now.
        self.adjustGameInCalendar(aCalendarId, aCalendarEvent, aGame);
      },

      function(aGame) {
        self.submitGameToCalendar(aCalendarId, aGame);
      });

    for (var key in this.mGames) {
      if (this.mGames.hasOwnProperty(key)) {
        var game = this.mGames[key];
        this.findGameInCalendar(aCalendarId, game, callback);
      }
    }
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
    // First, delete the old event.
    var request = gapi.client.calendar.events.delete({
      'calendarId' : aCalendarId,
      'eventId' : aEvent.id
    });
    request.execute();

    // Now, submit the new event.
    this.submitGameToCalendar(aCalendarId, aGame, true);

    // Finally, notify that the game was adjusted.
    this.notifyGameAdjusted(aGame);
  },

  /**
   * Submits a game to Google Calendar using the javascript rest api.
   *
   * @param aCalendarId The id of the calendar which should have the event.
   * @param aGame The Game to submit to the calendar.
   * @param aSuppressMessage If true, then no message will be shown for this event
   *        being added. Defaults to false.
   */
  submitGameToCalendar: function(aCalendarId, aGame, aSuppressMessage) {
    var eventToInsert = aGame.getEventJSON();
    var request = gapi.client.calendar.events.insert({
      'calendarId' : aCalendarId,
      'resource' : eventToInsert
    });
    request.execute(function(aResponse){
      if (!aResponse['error']) {
        console.log("Request to submit game to calendar was successful");
      } else {
        console.log("An error occurred: " + aResponse);
      }
    });

    if (!aSuppressMessage) {
      this.notifyGameAdded(aGame);
    }
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
  findGameInCalendar: function(aCalendarId, aGame, aCallback) {
    var searchString = "{ArbitratorHash: " + aGame.getHash() + "}";
    var request = gapi.client.calendar.events.list({
      'calendarId' : aCalendarId
    });
    request.execute(function(aResponse) {
      var results = aResponse.items;
      var foundEvent = false;
      for (var i = 0; i < results.length; i++) {
        var calEvent = results[i];
        if (calEvent.description
            && calEvent.description.contains(searchString)) {
            aCallback.onMatchFound(aGame, calEvent)
            foundEvent = true;
            break;
        }
      }

      if (!foundEvent) {
        aCallback.onNoMatchFound(aGame);
      }
    });
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

  /**
   * Search through all games to find those that are consecutive.
   *
   * Note that this does not currently search through calendar history. That is,
   * only games that are entered together in the same Arbitrator object are
   * under consideration for being linked in a consecutive manner.
   */
  findConsecutiveGames: function() {
    var prefStore = new PreferenceStore();
    var gameLengthMins = prefStore.getTimePreference(TimeType.LENGTH_OF_GAME, 60);
    var prevGame;
    for (index in this.mGames) {
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
