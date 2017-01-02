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
    this._regenerateGameAgeLevelIds();
  },

  removeGameAgeLevel: function(aGameAgeLevel) {
    for (var idx in this.mGameAgeLevels) {
      if (this.mGameAgeLevels[idx].equals(aGameAgeLevel)) {
        this.mGameAgeLevels.splice(idx, 1);
        this._regenerateGameAgeLevelIds();
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

  /**
   * Remove a {GameAgeLevel} by its id.
   *
   * @param {string} aId An identifier string to match against.
   */
  removeGameAgeLevelById: function(aId) {
    for (var idx in this.mGameAgeLevels) {
      if (this.mGameAgeLevels[idx].getId() == aId) {
        this.mGameAgeLevels.splice(idx, 1);
        this._regenerateGameAgeLevelIds();
        return;
      }
    }
  },

  /**
   * Retrieve a {GameAgeLevel} by its id.
   *
   * @param {string} aId An identifier string to match against.
   *
   * @return A {GameAgeLevel}, if one exists that has id == aId; null,
   *         otherwise.
   */
  getGameAgeLevelById: function(aId) {
    for (var i = 0; i < this.mGameAgeLevels.length; i++) {
      if (this.mGameAgeLevels[i].getId() == aId) {
        return this.mGameAgeLevels[i];
      }
    }

    return null;
  },

  /**
   * Find a {GameAgeLevel} matching the given search string, if one exists.
   *
   * @param {string} aSearchString The string to compare against regular
   *        expressions in each of the {GameAgeLevel}s contained in this
   *        {GameAgeProfile}.
   * @return {Object} The first {GameAgeLevel} whose regular expression matches
   *         the search string, if one exists; null, otherwise.
   */
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
  },

  /**
   * Regenerate all ids for {GameAgeLevel} settings within this
   * {GameAgeProfile}.
   */
  _regenerateGameAgeLevelIds: function() {
    for (var idx in this.mGameAgeLevels) {
      this.mGameAgeLevels[idx].setId(idx);
    }
  }
}

export var GameAgeLevel = function (age, level, regularExpression) {
  this.mAge = age;
  this.mLevel = level;
  this.mRegEx = regularExpression;
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
