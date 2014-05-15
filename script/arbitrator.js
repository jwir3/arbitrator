var Arbitrator = function(aString) {
  this.mBaseString = aString;
  this.mGames = new Array();
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
      console.log("***** DEBUG_jwir3: Trimmed column is: " + trimmedCol);
      if (trimmedCol.length != 0) {
        row.push(trimmedCol);
      } else if (i == 1){
        row.push("NONE");
      }

      i = i + 1;
      if (i%10 == 0) {
        this.mTable.push(row);
        row = new Array();
        var gm = new Game(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]);
        this.mGames.push(gm);
        console.log(gm);
      }
    }

    this.mTable.push(row);
  },

  getRows: function() {
    return this.mTable;
  },

  getColumns: function(aRow) {
    return this.mTable[aRow];
  },

  getDateString: function(aRow) {
    // The date/time of the game will always be in column 4
    return this.mTable[aRow][3];
  },

  getDate: function(aRow) {
    return new Date(Date.parse(this.getDateString(aRow)));
  },

  getDescription: function(aRow) {
    // Game description is column 5
    return this.mTable[aRow][5];
  },

  /**
   * @returns 0, if the row is a referee assignment; 1, if the row is a linesman
   *          assignment; -1 otherwise.
   */
  getRole: function(aRow) {
    // Role is column 3, and can be either "Referee" or "Linesman".
    var roleString = this.mTable[aRow][2];
    console.log("***** DEBUG_jwir3: roleString: " + roleString);
    if (roleString.search(/referee/i) != -1) {
      return 0;
    } else if (roleString.search(/linesman/i) != -1) {
      return 1;
    } else {
      return -1;
    }
  }
}
