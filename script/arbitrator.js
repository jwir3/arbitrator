var Arbitrator = function(aString) {
  this.mBaseString = aString;
  this.mGames = {};
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
      console.log("Col is: " + col);
      var trimmedCol = cols[col].trim();
      console.log("trimmedCol: " + trimmedCol);
      if (trimmedCol.length != 0) {
        var oldLength = row.length;
        var newLength = row.push(trimmedCol);
        if (oldLength === newLength) {
            console.log("Encountered an error while pushing! Oldlength == newLength");
        }

        console.log("Pushing trimmedCol. Row now has: " + row.length + " elements.");
      } else if (columnPointer == 1){
        row.push("NONE");
        console.log("Pushing NONE. Row now has: " + row.length + " elements.");
      }

      console.log("Row[" + columnPointer + "] is now: " + row[columnPointer]);

      // Special date handling, in the event that we get cut off at the knees
      // while parsing our time.
      if (columnPointer == 4
          && (row[columnPointer].endsWith("PM")
              || row[columnPointer].endsWith("AM"))) {
        row[columnPointer-1] = row[columnPointer-1] + " " + row[columnPointer];
        row.pop();
      }

      columnPointer = columnPointer + 1;
      if (columnPointer == 9) {
        console.log("Pushing a single row");
        this.mTable.push(row);
        var gm = new Game(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
        row = new Array();
        this.mGames[gm.getId()] = gm;
        columnPointer = 0;
      }
    }
  },

  getGameById: function(aId) {
    console.log(this.mGames);
    return this.mGames[aId];
  },

  getRows: function() {
    return this.mTable;
  },

  getColumns: function(aRow) {
    console.log("this.mTable[" + aRow + "] is: " + this.mTable[aRow]);
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
      var eventToInsert = this.mGames[key].getEventJSON();
      var request = gapi.client.calendar.events.insert({
        'calendarId' : aCalendarId,
        'resource' : eventToInsert
      });
      request.execute(function(response){
        console.log(response);
      });
      this.notifyGameAdded(this.mGames[key]);
      break;
    }
  }
}
