var gameLevels = {
  'Mite' : 'Mite',
  'Squirt' : 'Squirt',
  'Peewee' : 'Peewee',
  'Bantam' : 'Bantam',
  'Junior' : 'Junior',
  'Midget' : 'Midget',
  'SC' : 'Squirt C',
  'SB' : 'Squirt B',
  'SA' : 'Squirt A',
  'PC' : 'Peewee C',
  'PB' : 'Peewee B',
  'PA' : 'Peewee A',
  '10U': '10U Girls',
  '12U': '12U Girls',
  '14U': '14U Girls',
  '16U': '16U Girls',
  '19U': '19U Girls'
};

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

  isTeamValid: function(aTeamName) {
    switch(aTeamName) {
      case 'TBD':
        return false;
      case 'TBA':
        return false;
      default:
        return true;
    }
  },

  getLevel: function() {
    // See hashmap of levels at the top of the file.
    // TODO: Add a better algorithm for this.
    var levelString = this.getSportLevel();
    for (var level in gameLevels.keys()) {
      if (levelString.contains(level)) {
        return gameLevels[level];
      }
    }

    // TODO: Add analytics so that we know what the unknown was.
    return "UNKNOWN";
  },

  areTeamsValid: function() {
    return this.isTeamValid(this.mHomeTeam) && this.isTeamValid(aAwayTeam);
  },

  getSummaryString: function() {
    var summaryString = "";
    if (this.getGroup() != "NONE") {
      summaryString = summaryString + "[" + this.getGroup() + "] ";
    }

    var role = this.getRole();
    if (role == 0) {
      summaryString = summaryString + "Referee ";
    } else if (role == 1) {
      summaryString = summaryString + "Linesman ";
    } else {
      summaryString = summaryString + "Officiate ";
    }

//    if (this.areTeamsValid()) {
      summaryString = summaryString + this.mHomeTeam + " v " + this.mAwayTeam + " ";
//    }
    return summaryString;
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
      "summary": this.getSummaryString()
    };
  }
}
