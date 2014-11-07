var gameLevels = {
  'Mite' : 'Mite',
  'Squirt' : 'Squirt',
  'Peewee' : 'Peewee',
  'Bantam' : 'Bantam',
  'Junior Gold' : 'Junior Gold',
  'Junior' : 'Junior',
  'SC' : 'Squirt C',
  'SB' : 'Squirt B',
  'SA' : 'Squirt A/AA/AAA',
  'PC' : 'Peewee C',
  'PB' : 'Peewee B',
  'PA' : 'Peewee A/AA/AAA',
  'BC' : 'Bantam C',
  'BB' : 'Bantam B',
  'BA' : 'Bantam A/AA/AAA',
  'JGC': 'Junior Gold C',
  'JGB': 'Junior Gold B',
  'JGA': 'Junior Gold A/AA/AAA',
  '10U': '10U Girls',
  '12U': '12U Girls',
  '14U': '14U Girls',
  '16U': '16U Girls',
  '19U': '19U Girls'
};

var Game = function(aId, aGroup, aRole, aTimestamp, aSportLevel, aSite, aHomeTeam, aAwayTeam, aFees) {
  console.log("***** DEBUG_jwir3: Called game constructor with aRole: " + aRole);
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
    var levelKeys = Object.keys(gameLevels);
    for (var level in levelKeys) {
      if (levelString.contains(levelKeys[level])) {
        return gameLevels[levelKeys[level]];
      }
    }

    // Check for a year
    var yearStringIdx = levelString.search(/([0-9]{4})/g);
    var yearString = levelString.slice(yearStringIdx, yearStringIdx+4);

    console.log("yearString: " + yearString);
    if (yearString) {
        var currentYear = (new Date()).getFullYear();
        console.log("Current year: " + currentYear);
        var age = parseInt(currentYear,10) - yearString;
        console.log("Current age: " + age);
        if (age <= 8) {
          return 'Mite';
        } else if (age > 8 && age <= 10) {
          return 'Squirt';
        } else if (age > 10 && age <= 12) {
          return 'Peewee';
        } else if (age > 12 && age <= 14) {
          return 'Bantam';
        } else if (age > 14 && age <= 16) {
          return '16U Boys/Girls';
        } else if (age > 16 && age <= 18) {
          return 'Junior Gold';
        } else if (age > 18 && age <= 20) {
          return 'Junior';
        } else if (age > 20){
          return 'Senior Mens/Womens';
        }
    }

    // TODO: Add analytics so that we can determine what the unknown was.
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

   if (this.areTeamsValid()) {
      summaryString = summaryString + this.mHomeTeam + " v " + this.mAwayTeam + " ";
   }

   var level = this.getLevel();
   if (level != 'UNKNOWN') {
     summaryString = summaryString + "(" + level + ")";
   }

   return summaryString.trim();
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
