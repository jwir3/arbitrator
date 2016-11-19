import { Game } from './Game.js';
import { UIManager } from './UIManager';
import { PreferenceSingleton, TimeType } from './PreferenceStore';
import { ArbitratorGoogleClient } from './ArbitratorGoogleClient';
import { Strings } from './Strings';

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

export var Arbitrator = function(aString) {
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
              self.mUiManager.showSnackbar(Strings.games_added_message);
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
                    self.mUiManager.showSnackbar(Strings.games_added_message);
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
