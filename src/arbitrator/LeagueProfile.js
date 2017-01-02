/**
 * Create a new {LeagueProfile} object.
 *
 * @param {string} aProfileIdentifier The identifier to use for the new profile.
 *        It should be unique.
 */
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

  /**
   * Add a new {GameClassificationLevel} to this {LeagueProfile}.
   *
   * @param {GameClassificationLevel} aGameClassificationLevel The new {GameClassificationLevel} to add.
   */
  addGameClassificationLevel: function(aGameClassificationLevel) {
    this.classificationLevels.push(aGameClassificationLevel);
    this._regenerateGameClassificationLevelIds();
  },

  /**
   * Remove an existing {GameClassificationLevel} from this {LeagueProfile}.
   *
   * @param  {GameClassificationLevel} aGameClassificationLevel The {GameClassificationLevel} object to remove from this {LeagueProfile}.
   */
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

  getNumLevels: function() {
    return this.classificationLevels.length;
  },

  /**
   * Retrieve the {GameClassificationLevel} objects held in this
   * {LeagueProfile}, sorted first by classification, then by level.
   *
   * @return {Array} An array of {GameClassificationLevel}s, sorted in
   *                 alphabetical order.
   */
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

/**
 * Create a new GameClassificationLevel.
 *
 * @param {String} classification    The classification of this new
 *                                   {GameClassificationLevel}. This can be an
 *                                   age group (e.g. "Bantam" or "Squirt"), or
 *                                   a gender classification (e.g. "Boys").
 * @param {String} level             The level of play for the new object. This
 *                                   can be a recreational level (e.g. A, B, C),
 *                                   or some other level descriptor (e.g.
 *                                   Varsity).
 * @param {String} regularExpression The regular expression which will be used
 *                                   to match sport levels of input strings
 *                                   with the new object.
 */
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

  /**
   * Determine if this {GameClassificationLevel} matches an input string.
   *
   * @param  {String} aSportLevelInput An input string to match against.
   *
   * @return {boolean}                  true, if this object's regular
   *                                    expression matches the given input
   *                                    string; false, otherwise.
   */
  matches: function(aSportLevelInput) {
    var regularExpression = new RegExp(this.regularExpression);
    return regularExpression.test(aSportLevelInput);
  }
};
