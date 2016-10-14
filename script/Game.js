module.exports = Game;

var Place = require('./Place');
var PreferenceStore = require('./PreferenceStore');
var CryptoJS = require('crypto-js');

var gameLevels = {
  'Mite'            : 'Mite',
  'Squirt'          : 'Squirt',
  'Peewee'          : 'Peewee',
  'Bantam'          : 'Bantam',
  'Junior Gold'     : 'Junior Gold',
  'Junior'          : 'Junior',
  'SC'              : 'Squirt C',
  'SB'              : 'Squirt B',
  'SA'              : 'Squirt A/AA/AAA',
  'PC'              : 'Peewee C',
  'PB'              : 'Peewee B',
  'PA'              : 'Peewee A/AA/AAA',
  'BC'              : 'Bantam C',
  'BB'              : 'Bantam B',
  'BA'              : 'Bantam A/AA/AAA',
  'JGB'             : 'Junior Gold B',
  'JGA'             : 'Junior Gold A/AA/AAA',
  '10U'             : '10U Girls',
  '10A'             : '10U Girls A',
  '10B'             : '10U Girls B',
  '12U'             : '12U Girls',
  '12A'             : '12U Girls A',
  '12B'             : '12U Girls B',
  '14U'             : '14U Girls',
  '16U'             : '16U Girls',
  '19U'             : '19U Girls',
  'Boys, Varsity'   : 'Varsity Boys',
  'Girls, Varsity'  : 'Varsity Girls',
  'Boys, JV'        : 'Junior Varsity Boys',
  'Girls, JV'       : 'Junior Varsity Girls'
};

/**
 * Enumeration for Roles. Currently, an official (for hockey) can be one of the
 * following:
 *
 *  - A Referee
 *  - A Linesman
 *  - An unknown role
 *
 * No other roles are supported at this time. In the future, it would be nice to
 * support other roles, but it's unclear how long this polyfill for lack of
 * Google calendar support in AS will last.
 */
var Role = Object.freeze({
  REFEREE: 0,
  LINESMAN: 1,
  UNKNOWN: -1
});

function Game(aId, aGroup, aRole, aTimestamp, aSportLevel, aSite,
              aHomeTeam, aAwayTeam, aFees) {
  var prefStore = new PreferenceStore();
  this.mId = aId;
  this.mGroup = prefStore.getAliasForGroupId(aGroup);
  this.setRole(aRole);
  this.mTimestamp = aTimestamp;
  this.mSportLevel = aSportLevel;
  this.mSite = this.getPlaceForSite(aSite);
  this.mHomeTeam = aHomeTeam;
  this.mAwayTeam = aAwayTeam;
  this.mFees = aFees;
  this.mIsConsecutiveGame = false;
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

  getTime12Hr: function() {
      var timestamp = this.getTimestamp();
      var hour = timestamp.getHours();
      var ampm = (hour >= 12) ? 'pm' : 'am';
      if (hour > 12) {
        hour = hour - 12;
      }

      return hour
             + ":" + (timestamp.getMinutes() < 10 ? "0" : "")
             + timestamp.getMinutes() + ampm;
  },

  getISOStartDate: function() {
    var prefStore = new PreferenceStore();
    var startDate = this.getTimestamp();
    var priorToStart = prefStore.getTimePreference(PreferenceStore.TimeType.PRIOR_TO_START, 30);
    if (this.isConsecutiveGame()) {
      priorToStart = 0;
    }
    return new Date(startDate.setMinutes(startDate.getMinutes() - priorToStart)).toISOString();
  },

  getISOEndDate: function() {
    var prefStore = new PreferenceStore();
    var endDate = this.getTimestamp();

    // Default to 1 hour if no time preference is specified.
    var gameLengthMins = prefStore.getTimePreference(PreferenceStore.TimeType.LENGTH_OF_GAME, 60);
    return new Date(endDate.setMinutes(endDate.getMinutes() + gameLengthMins)).toISOString();
  },

  /**
   * Determines if this game is a consecutive game (a game where the preceding
   * game is at the same site and ended within two hours of the start of this
   * game).
   *
   * @return true, if this game is a consecutive game; false, otherwise.
   */
  isConsecutiveGame: function() {
    return this.mIsConsecutiveGame;
  },

  /**
   * Set whether or not this game is a consecutive game (a game where the
   * preceding game is at the same site and ended within two hours of the start
   * of this game).
   *
   * @param aIsConsecutive Whether or not this is a consecutive game
   */
  setConsecutiveGame: function(aIsConsecutive) {
    this.mIsConsecutiveGame = aIsConsecutive;
  },

  /**
   * Determines if this game is within the time range (within the same day and
   * within the consecutive game threshold) necessary to be considered for a
   * possible consecutive game with another game.
   *
   * @param aGame A Game for which this game should be determined to follow by
   *        less than the threshold for consecutive games.
   *
   * @return true, if this Game is within the time range necessary to make it a
   *         potential consecutive game; false, otherwise.
   */
  isWithinConsecutiveTimeRangeOf: function(aGame) {
    var prefStore = new PreferenceStore();
    var consecutiveGameThreshold = prefStore.getTimePreference(PreferenceStore.TimeType.CONSECUTIVE_GAME_THRESHOLD, 2);
    var aOtherTimestamp = aGame.getTimestamp();
    var timeStamp = this.getTimestamp();
    return aOtherTimestamp.getDate() == timeStamp.getDate()
           && aOtherTimestamp.getFullYear() == timeStamp.getFullYear()
           && aOtherTimestamp.getMonth() == timeStamp.getMonth()
           && aOtherTimestamp.getHours() + consecutiveGameThreshold >= timeStamp.getHours()
  },

  setRole: function(aRoleString) {
    // Role is column 3, and can be either "Referee" or "Linesman".
    if (aRoleString.search(/referee/i) != -1) {
      this.mRole = Role.REFEREE;
    } else if (aRoleString.search(/linesman/i) != -1) {
      this.mRole = Role.LINESMAN;
    } else {
      this.mRole = Role.UNKNOWN;
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
      if (levelString.indexOf(levelKeys[level])) {
        return gameLevels[levelKeys[level]];
      }
    }

    // Check for a year
    var yearStringIdx = levelString.search(/([0-9]{4})/g);
    var yearString = levelString.slice(yearStringIdx, yearStringIdx+4);

    if (yearString) {
        var currentYear = (new Date()).getFullYear();
        var age = parseInt(currentYear,10) - yearString;
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
    return this.isTeamValid(this.mHomeTeam) && this.isTeamValid(this.mAwayTeam);
  },

  getSummaryString: function() {
    var summaryString = "";
    if (this.getGroup() != "NONE") {
      summaryString = summaryString + "[" + this.getGroup() + "] ";
    }

    var role = this.getRole();
    if (role == Role.REFEREE) {
      summaryString = summaryString + "Referee ";
    } else if (role == Role.LINESMAN) {
      summaryString = summaryString + "Linesman ";
    } else {
      summaryString = summaryString + "Officiate ";
    }

   if (this.isScrimmage()) {
      summaryString = summaryString + "Scrimmage ";
   }

   if (this.areTeamsValid()) {
      summaryString = summaryString + this.mHomeTeam + " v " + this.mAwayTeam + " ";
   }

   var level = this.getLevel();
   if (level != 'UNKNOWN') {
     summaryString = summaryString + "(" + level + (this.isTournament() ? " Tournament" : "") + ")";
   }

   return summaryString.trim();
  },

  getRole: function() {
    return this.mRole;
  },

  getEventJSON: function() {
    var siteData = this.getSite().getAddress() ? this.getSite().getAddress() : this.getSite().getName();
    return  {
      "end": {
        "dateTime": this.getISOEndDate()
      },
      "start": {
        "dateTime": this.getISOStartDate()
      },
      "location": siteData,
      "description": "Game starts at " + String(this.getTime12Hr()) + "\n\n" + "{ArbitratorHash: " + String(this.getHash()) + "}",
      "summary": this.getSummaryString()
    };
  },

  isScrimmage: function() {
    return this.getSportLevel().search(/scrimmage/i) != -1;
  },

  isTournament: function() {
    return this.getSportLevel().search(/tournament/i) != -1;
  },

  /**
   * Retrieve an identification string for this game. Essentially, this is
   * just a concatenation of the game id, the group, teams playing, and level.
   *
   * @return A string that is an identifier for this game. This identifier should
   *         not change, even if the game dates/times change.
   */
   getIdentificationString: function() {
      var level = this.getLevel() === "UNKNOWN" ? "" : this.getLevel();
      var teams = this.areTeamsValid() ? this.getHomeTeam() + "v" + this.getAwayTeam() : "";
      var idString = String(this.getId());
      idString = idString + this.getGroup() + level + teams;

      return idString.replace(/\s+/gm, "");
   },

  /**
   * Retrieve a hash of the unique identifying information of this game. This
   * serves to identify the game if the date/time changes.
   *
   * @return A string of a SHA-1 hash of the game id, group, teams playing, and level.
   */
  getHash: function() {
    return CryptoJS.SHA1(this.getIdentificationString()).toString(CryptoJS.enc.Hex);
  },


  /**
   * Retrieve a Place object for some existing site string.
   *
   * @param aSiteName The textual name of the site, as passed in from ArbiterSports.
   *
   * @returns A Place object with name equivalent to aSiteName, but with an address
   *          if one was found in the preference store.
   */
  getPlaceForSite: function(aSiteName) {
    // Convert the site name to a key
    var placeKey = aSiteName.replace(/\s/g, '');

    var prefStore = new PreferenceStore();
    if (prefStore.hasLocationPreference(placeKey)) {
      return prefStore.getLocationPreference(placeKey);
    }

    var place = new Place(placeKey, aSiteName, undefined);
    prefStore.addLocationPreference(place);
    return place;
  }
}
