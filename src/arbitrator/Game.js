import * as CryptoJS from 'crypto-js'
import { Place } from './Place'
import { PreferenceSingleton, TimeType } from './PreferenceStore'
import * as moment from 'moment';
import { Strings } from './Strings'

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
export var Role = Object.freeze({
  REFEREE: 0,
  LINESMAN: 1,
  UNKNOWN: -1
});

export var Game = function (aId, aGroup, aRole, aTimestamp, aSportLevel, aSite,
                            aHomeTeam, aAwayTeam, aFees) {
  var prefStore = PreferenceSingleton.instance;
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
    // Retrieves the arbiter-printed string, which currently has the format:
    // MM/DD/YYYY h:MM A
    var components = this.mTimestamp.split(" ");
    return components[0] + " " + components[2] +  " " + components[3];
  },

  /**
   * Retrieve the moment for which this game starts.
   *
   * @return {Moment} A Moment.js moment for which this game is set to start,
   *                  based on the data from ArbiterSports.
   */
  getTimestamp: function() {
    return moment(this.getTimestampAsString(), "MM/DD/YYYY h:mm a");
  },

  getTime12Hr: function() {
    return this.getTimestamp().format("h:mma");
  },

  getISOStartDate: function() {
    var prefStore = PreferenceSingleton.instance;
    var startDate = this.getTimestamp();
    var priorToStart = prefStore.getTimePreference(TimeType.PRIOR_TO_START, 30);
    if (this.isConsecutiveGame()) {
      priorToStart = 0;
    }

    return startDate.subtract(priorToStart, 'minutes').toISOString();
  },

  getISOEndDate: function() {
    var prefStore = PreferenceSingleton.instance;
    var endDate = this.getTimestamp();

    // Default to 1 hour if no time preference is specified.
    var gameLengthMins = prefStore.getTimePreference(TimeType.LENGTH_OF_GAME, 60);
    return endDate.add(gameLengthMins, 'minutes').toISOString();
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
    var prefStore = PreferenceSingleton.instance;
    var consecutiveGameThreshold = prefStore.getTimePreference(TimeType.CONSECUTIVE_GAME_THRESHOLD, 2);
    var aOtherTimestamp = aGame.getTimestamp();
    var timeStamp = this.getTimestamp();
    return aOtherTimestamp.date() == timeStamp.date()
           && aOtherTimestamp.year() == timeStamp.year()
           && aOtherTimestamp.month() == timeStamp.month()
           && aOtherTimestamp.hours() + consecutiveGameThreshold >= timeStamp.hours()
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
    var levelString = this.getSportLevel();
    var prefStore = PreferenceSingleton.instance;

    // Load all game level preferences for the given group.
    var gameProfile = prefStore.getGameAgeProfile(this.getGroup());

    if (!gameProfile) {
      console.warn(`No game age profile was found for group '${this.getGroup()}'. Unable to resolve game age level '${levelString}'`);
      return 'UNKNOWN';
    }

    // Find one where the regex matches.
    var matchingGameAgeLevel = gameProfile.findGameAgeLevelMatching(levelString);
    if (!matchingGameAgeLevel) {
      console.warn(`Unable to find game age/level matching ${levelString} in profile for '${this.getGroup()}'`);
      return 'UNKNOWN';
    }

    return matchingGameAgeLevel.getAge() + " " + matchingGameAgeLevel.getLevel();
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
      summaryString = summaryString + Strings.referee + " ";
    } else if (role == Role.LINESMAN) {
      summaryString = summaryString + Strings.linesman + " ";
    } else {
      summaryString = summaryString + Strings.officiate + " ";
    }

   if (this.isScrimmage()) {
      summaryString = summaryString + Strings.scrimmage + " ";
   }

   if (this.areTeamsValid()) {
      summaryString = summaryString + this.mHomeTeam + " v " + this.mAwayTeam + " ";
   }

   var level = this.getLevel();
   if (level != 'UNKNOWN') {
     summaryString = summaryString + "(" + level + (this.isTournament() ? " " + Strings.tournament : "") + ")";
   }

   return summaryString.trim();
  },

  getRole: function() {
    return this.mRole;
  },

  getEventJSON: function() {
    var siteData = this.getSite().getAddress() ? this.getSite().getAddress() : this.getSite().getName();
    var subLocationString = this.getSite().hasSubLocation() ? "\n\n" + Strings.rink + " " + this.getSite().getSubLocationName() : "";
    return  {
      "end": {
        "dateTime": this.getISOEndDate()
      },
      "start": {
        "dateTime": this.getISOStartDate()
      },
      "location": siteData,
      "description": "Game starts at " + String(this.getTime12Hr())
                     + subLocationString
                     + "\n\n{ArbitratorHash: " + String(this.getHash()) + "}",
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
      // var level = this.getLevel() === "UNKNOWN" ? "" : this.getLevel();
      // var teams = this.areTeamsValid() ? this.getHomeTeam() + "v" + this.getAwayTeam() : "";
      var idString = String(this.getId());
      // idString = idString + this.getGroup() + level + teams;

      return idString.replace(/\s+/gm, "");
   },

  /**
   * Retrieve a hash of the unique identifying information of this game. This
   * serves to identify the game if the date/time changes.
   *
   * @return A string of a SHA-1 hash of the game id.
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

    var prefStore = PreferenceSingleton.instance;
    if (prefStore.hasLocationPreference(placeKey)) {
      return prefStore.getLocationPreference(placeKey);
    }

    var place = new Place(placeKey, aSiteName, undefined, "");
    prefStore.addLocationPreference(place);
    return place;
  }
}
