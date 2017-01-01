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

  removeGameAgeLevel: function(aGameAgeLevel) {
    for (var idx in this.mGameAgeLevels) {
      if (this.mGameAgeLevels[idx].equals(aGameAgeLevel)) {
        this.mGameAgeLevels.splice(idx, 1);
      }
    }
  },

  getProfileId: function() {
    return this.mProfileId;
  },

  getNumLevels: function() {
    return this.mGameAgeLevels.length;
  },

  getLevels: function() {
    return this.mGameAgeLevels.sort(function(a, b) {
      if (a.getAge() == b.getAge()) {
        if (a.getLevel() < b.getLevel()) {
          return -1;
        } else if (a.getLevel() == b.getLevel()) {
          return 0;
        } else {
          return 1;
        }
      } else if (a.getAge() < b.getAge()) {
        return -1;
      } else {
        return 1;
      }
    });
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

  setAge: function(aAge) {
    this.mAge = aAge;
  },

  getAge: function() {
    return this.mAge;
  },

  setLevel: function(aLevel) {
    this.mLevel = aLevel;
  },

  getLevel: function() {
    return this.mLevel;
  },

  setRegEx: function(aRegEx) {
    this.mRegEx = aRegEx;
  },

  getRegEx: function() {
    return this.mRegEx;
  },

  equals: function(aOther) {
    return this.mAge == aOther.mAge
      && this.mLevel == aOther.mLevel
      && this.mRegEx == aOther.mRegEx;
  },

  matches: function(aSportLevelInput) {
    var regularExpression = new RegExp(this.mRegEx);
    return regularExpression.test(aSportLevelInput);
  }
};
