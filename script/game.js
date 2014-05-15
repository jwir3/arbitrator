var Game = function(aId, aGroup, aTimestamp, aSportLevel, aSite, aHomeTeam, aAwayTeam, aFees) {
  this.mId = aId;
  this.mGroup = aGroup;
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
  }
}
