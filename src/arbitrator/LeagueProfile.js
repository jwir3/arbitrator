export var LeagueProfile = function(aProfileIdentifier) {
  this.profileId = aProfileIdentifier;
  this.classificationLevels = [];
}

/**
 * A profile containing {GameClassificationLevel}s. Typically, the profile will
 * be associated with a group, but it can conceivably be associated with any
 * string.
 */
LeagueProfile.prototype = {
  profileId: null,
  classificationLevels: [],

  addGameClassificationLevel: function(aGameClassificationLevel) {
    this.classificationLevels.push(aGameClassificationLevel);
    this._regenerateGameClassificationLevelIds();
  },

  removeGameClassificationLevel: function(aGameClassificationLevel) {
    for (var idx in this.classificationLevels) {
      if (this.classificationLevels[idx].equals(aGameClassificationLevel)) {
        this.classificationLevels.splice(idx, 1);
        this._regenerateGameClassificationLevelIds();
      }
    }
  },

  getProfileId: function() {
    return this.profileId;
  },

  getNulevels: function() {
    return this.classificationLevels.length;
  },

  getLevels: function() {
    return this.classificationLevels.sort(function(a, b) {
      if (a.getClassification() == b.getClassification()) {
        if (a.getLevel() < b.getLevel()) {
          return -1;
        } else if (a.getLevel() == b.getLevel()) {
          return 0;
        } else {
          return 1;
        }
      } else if (a.getClassification() < b.getClassification()) {
        return -1;
      } else {
        return 1;
      }
    });
  },

  /**
   * Remove a {GameClassificationLevel} by its id.
   *
   * @param {string} aId An identifier string to match against.
   */
  removeGameClassificationLevelById: function(aId) {
    for (var idx in this.classificationLevels) {
      if (this.classificationLevels[idx].getId() == aId) {
        this.classificationLevels.splice(idx, 1);
        this._regenerateGameClassificationLevelIds();
        return;
      }
    }
  },

  /**
   * Retrieve a {GameClassificationLevel} by its id.
   *
   * @param {string} aId An identifier string to match against.
   *
   * @return A {GameClassificationLevel}, if one exists that has id == aId; null,
   *         otherwise.
   */
  getGameClassificationLevelById: function(aId) {
    for (var i = 0; i < this.classificationLevels.length; i++) {
      if (this.classificationLevels[i].getId() == aId) {
        return this.classificationLevels[i];
      }
    }

    return null;
  },

  /**
   * Find a {GameClassificationLevel} matching the given search string, if one exists.
   *
   * @param {string} aSearchString The string to compare against regular
   *        expressions in each of the {GameClassificationLevel}s contained in this
   *        {LeagueProfile}.
   * @return {Object} The first {GameClassificationLevel} whose regular expression matches
   *         the search string, if one exists; null, otherwise.
   */
  findGameClassificationLevelMatching: function(aSearchString) {
    var firstFound = null;
    for (var idx in this.classificationLevels) {
      if (this.classificationLevels[idx].matches(aSearchString)) {
        if (!firstFound) {
          firstFound = this.classificationLevels[idx];
        } else {
          console.warn(`There are multiple game classifications that match the search string '${aSearchString}'. You may have overlapping regular expressions.`);
        }
      }
    }

    return firstFound;
  },

  /**
   * Regenerate all ids for {GameClassificationLevel} settings within this
   * {LeagueProfile}.
   */
  _regenerateGameClassificationLevelIds: function() {
    for (var idx in this.classificationLevels) {
      this.classificationLevels[idx].setId(idx);
    }
  }
}

export var GameClassificationLevel = function (classification, level, regularExpression) {
  this.classification = classification;
  this.level = level;
  this.regularExpression = regularExpression;
}

/**
 * A data structure representing a {Game} object's classification and ability
 * level.
 *
 * Each object contains a regular expression to search for, along with
 * a classification bracket (can be numeric or a name, such as 'Bantam'), and a
 * level (e.g. 'A', 'B', Varsity, etc...).
 *
 * This can then be compared to inputs given in a particular game to determine
 * if it matches.
 *
 * @type {GameClassificationLevel}
 */
GameClassificationLevel.prototype = {
  classification: null,
  level: null,
  regularExpression: null,
  id: null,

  setId: function(aId) {
    this.id = aId;
  },

  getId: function() {
    return this.id;
  },

  setClassification: function(aclassification) {
    this.classification = aclassification;
  },

  getClassification: function() {
    return this.classification;
  },

  setLevel: function(aLevel) {
    this.level = aLevel;
  },

  getLevel: function() {
    return this.level;
  },

  setRegEx: function(aRegEx) {
    this.regularExpression = aRegEx;
  },

  getRegEx: function() {
    return this.regularExpression;
  },

  equals: function(aOther) {
    return this.classification == aOther.classification
      && this.level == aOther.level
      && this.regularExpression == aOther.regularExpression;
  },

  matches: function(aSportLevelInput) {
    var regularExpression = new RegExp(this.regularExpression);
    return regularExpression.test(aSportLevelInput);
  }
};
