var Arbitrator = function(aString) {
  this.mBaseString = aString;
  this.parse();
}

Arbitrator.prototype = {
  parse: function() {
    this.mRows = this.mBaseString.split('\n');
    console.log("***** DEBUG_jwir3: Base String: " + this.mBaseString);
    for (row in this.mRows) {
      console.log("***** DEBUG_jwir3: " + this.mRows[row]);
    }

    this.mTable = new Array(this.mRows.length);
    var i = 0;
    for (row in this.mRows) {
      var cols = this.mRows[row].split("\t");
      for (colNum in cols) {
        cols[colNum] = cols[colNum].trim();
      }
      this.mTable[i] = cols;
      i++;
    }
  },

  getRows: function() {
    return this.mRows;
  },

  getColumns: function(aRow) {
    return this.mTable[aRow];
  },

  getDateString: function(aRow) {
    // The date/time of the game will always be in column 4
    return this.mTable[aRow][4];
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
    var roleString = this.mTable[aRow][3];
    if (roleString.search(/referee/i) != -1) {
      return 0;
    } else if (roleString.search(/linesman/i) != -1) {
      return 1;
    } else {
      return -1;
    }
  }
}
