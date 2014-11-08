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
    var i = 0;
    var removedLastCol= false;
    for (col in cols) {
      var trimmedCol = cols[col].trim();
      if (trimmedCol.length != 0) {
        row.push(trimmedCol);
      } else if (i == 1){
        row.push("NONE");
      }

      // Special date handling, in the event that we get cut off at the knees
      // while parsing our time.
      if (i == 4 && (row[i].endsWith("PM") || row[i].endsWith("AM"))) {
        row[i-1] = row[i-1] + " " + row[i];
        row.pop();
      }

      i = i + 1;
      if (i%10 == 0) {
        this.mTable.push(row);
        var gm = new Game(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
        row = new Array();
        this.mGames[gm.getId()] = gm;
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
    // TODO: Re-enable this code once messaging is working correctly.
    //   console.log(this.mGames[key].getEventJSON());
    //   var eventToInsert = this.mGames[key].getEventJSON();
    //   var request = gapi.client.calendar.events.insert({
    //     'calendarId' : aCalendarId,
    //     'resource' : eventToInsert
    //   });
    //   request.execute(function(response){
    //     //console.log(response);
    //   });
    this.notifyGameAdded(this.mGames[key]);
    //   break;
    }
  }
}
