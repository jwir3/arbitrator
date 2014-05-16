var Game = function(aId, aGroup, aRole, aTimestamp, aSportLevel, aSite, aHomeTeam, aAwayTeam, aFees) {
  this.mId = aId;
  this.mGroup = aGroup;
  this.setRole(aRole);
  this.mTimestamp = aTimestamp;
  this.mSportLevel = aSportLevel;
  this.mSite = aSite;
  this.mHomeTeam = aHomeTeam;
  this.mAwayTeam = aAwayTeam;
  this.mFees = aFees;
}

Game.prototype = {
  getId: function() {
    return this.mId;
  },

  getSportLevel: function() {
    return this.mSportLevel;
  },

  setRole: function(aRoleString) {
    // Role is column 3, and can be either "Referee" or "Linesman".
    if (aRoleString.search(/referee/i) != -1) {
      this.mRole = 0;
    } else if (aRoleString.search(/linesman/i) != -1) {
      this.mRole = 1;
    } else {
      this.mRole = -1;
    }
  },

  getRole: function() {
    return this.mRole;
  }
}
