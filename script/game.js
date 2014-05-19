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

  getGroup: function() {
    return this.mGroup;
  },

  getSportLevel: function() {
    return this.mSportLevel;
  },

  getSite: function() {
    return this.mSite;
  },

  getHomeTeam: function() {
    return this.mHomeTeam;
  },

  getAwayTeam: function() {
    return this.mAwayTeam;
  },

  getFees: function() {
    return this.mFees;
  },

  getTimestampAsString: function() {
    return this.mTimestamp;
  },

  getTimestamp: function() {
    return new Date(Date.parse(this.getTimestampAsString()));
  },

  getISOStartDate: function() {
    return this.getTimestamp().toISOString();
  },

  getISOEndDate: function() {
    var endDate = this.getTimestamp();
    // One hour later...
    // TODO: Make this configurable.
    return new Date(endDate.setHours(endDate.getHours() + 1)).toISOString();
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
  },

  getEventJSON: function() {
    return  {
      "end": {
        "dateTime": this.getISOEndDate()
      },
      "start": {
        "dateTime": this.getISOStartDate()
      },
      "description": "Testing Arbitrator",
      "summary": "Arbitrator TESTAUTO"
    };
  }
}
