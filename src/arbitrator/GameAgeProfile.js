export var GameAgeProfile = function(aProfileIdentifier) {
  this.mProfileId = aProfileIdentifier;
  this.mGameAgeLevels = [];
}

/**
 * A profile containing {GameAgeLevel}s. Typically, the profile will be
 * associated with a group, but it can conceivably be associated with any string.
 */
GameAgeProfile.prototype = {
  mProfileId: null,
  mGameAgeLevels: [],

  addGameAgeLevel: function(aGameAgeLevel) {
    aGameAgeLevel.setId(this.mGameAgeLevels.length);
    this.mGameAgeLevels.push(aGameAgeLevel);
  },

  getProfileId: function() {
    return this.mProfileId;
  },

  getNumLevels: function() {
    return this.mGameAgeLevels.length;
  },

  getLevels: function() {
    return this.mGameAgeLevels;
  },

  findGameAgeLevelMatching: function(aSearchString) {
    var firstFound = null;
    for (var idx in this.mGameAgeLevels) {
      if (this.mGameAgeLevels[idx].matches(aSearchString)) {
        if (!firstFound) {
          firstFound = this.mGameAgeLevels[idx];
        } else {
          console.warn(`There are multiple game age levels that match the search string '${aSearchString}'. You may have overlapping regular expressions.`);
        }
      }
    }

    return firstFound;
  }
}

export var GameAgeLevel = function (regularExpression, age, level) {
  this.mRegEx = regularExpression;
  this.mAge = age;
  this.mLevel = level;
}

/**
 * A data structure representing a {Game} object's age and ability level.
 *
 * Each object contains a regular expression to search for, along with
 * an age bracket (can be numeric or a name, such as 'Bantam'), and a level
 * (e.g. 'A', 'B', Varsity, etc...).
 *
 * This can then be compared to inputs given in a particular game to determine
 * if it matches.
 *
 * @type {GameAgeLevel}
 */
GameAgeLevel.prototype = {
  mAge: null,
  mLevel: null,
  mRegEx: null,
  mId: null,

  setId: function(aId) {
    this.mId = aId;
  },

  getId: function() {
    return this.mId;
  },

  getAge: function() {
    return this.mAge;
  },

  getLevel: function() {
    return this.mLevel;
  },

  getRegEx: function() {
    return this.mRegEx;
  },

  matches: function(aSportLevelInput) {
    var regularExpression = new RegExp(this.mRegEx);
    return regularExpression.test(aSportLevelInput);
  }
};
