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
    this.mGameAgeLevels.push(aGameAgeLevel);
  },

  getProfileId: function() {
    return this.mProfileId;
  },

  getNumLevels: function() {
    return this.mGameAgeLevels.length;
  },

  findGameAgeLevelMatching: function(aSearchString) {
    for (var idx in this.mGameAgeLevels) {
      if (this.mGameAgeLevels[idx].matches(aSearchString)) {
        return this.mGameAgeLevels[idx];
      }
    }

    return null;
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

  getAge: function() {
    return this.mAge;
  },

  getLevel: function() {
    return this.mLevel;
  },

  matches: function(aSportLevelInput) {
    var regularExpression = new RegExp(this.mRegEx);
    return regularExpression.test(aSportLevelInput);
  }
};