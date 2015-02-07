// Constant used for terms which we don't care about in checkGame().
var DONTCARE = 'dontcare-1nsy';

/**
 * Check the parameters of a given game. You can use this to check any game
 * against expected values, and either pass the above 'DONTCARE' constant if
 * you don't care about a given term, or leave the parameter undefined.
 *
 * @param aArbitrator The Arbitrator object used to parse the data. Cannot be undefined.
 * @param aGameId The id of the game, as an integer. Cannot be undefined.
 * @param aExpectedGroup The expected 'group' for the game.
 * @param aExpectedRole The expected role of the official for the game. Must be
 *        one of Role.LINESMAN or Role.REFEREE.
 * @param aExpectedDayOfMonth The day of the month (1-31) for the game.
 * @param aExpectedMonth The expected month of the game, as a 0-indexed integer.
 *        (0 = JANUARY, 1 = FEBRUARY, etc...).
 * @param aExpectedYear The expected year of the game, as a four digit integer.
 * @param aExpectedHourOfDay The expected hour in the day for the game, as a
 *        0-indexed integer representing 24 possible hours (0 = 1am, 1=2am,
 *        16 = 4pm, etc...)
 * @param aExpectedMinuteOfHour The expected minute of the hour for the game, as
 *        a 0-indexed integer from 0-59.
 * @param aExpectedSportLevel The expected "sport and level" string of the game.
 *        This _should_ be just something like "Hockey, Boys Varsity", but often
 *        it's used to communicate other information (e.g. the ruleset).
 * @param aExpectedLevel The expected level of the game, as parsed from the
          getSportLevel() string.
 * @param aExpectedSite The site of the game, as a string. This must represent
 *        EXACTLY how the online site has it listed. No resolution of lat/long
 *        is currently performed.
 * @param aExpectedHomeTeam The name of the home team of the game.
 * @param aExpectedAwayTeam The name of the away team of the game.
 * @param aExpectScrimmage Whether or not this game is expected to be a scrimmage
 * @param aExpectTournament Whether or not this game is expected to be a
 *        tournament game.
 */
function checkGame(aArbitrator, aGameId, aExpectedGroup, aExpectedRole,
                   aExpectedDayOfMonth, aExpectedMonth, aExpectedYear,
                   aExpectedHourOfDay, aExpectedMinuteOfHour,
                   aExpectedSportLevel, aExpectedLevel, aExpectedSite,
                   aExpectedHomeTeam, aExpectedAwayTeam, aExpectScrimmage,
                   aExpectTournament) {
  // Only the game id and arbitrator must be present. All other things can be
  // undefined, indicating a "don't care" term.
  ok(aArbitrator, 'aArbitrator cannot be undefined');
  ok(aGameId, 'aGameId cannot be undefined');

  var game = aArbitrator.getGameById(aGameId);
  ok(game, 'Game with id ' + aGameId + ' should exist in the map');

  if (aExpectedGroup && aExpectedGroup != DONTCARE) {
    equal(game.getGroup(), aExpectedGroup, 'group should be ' + aExpectedGroup);
  }

  if (aExpectedRole && aExpectedRole != DONTCARE) {
    equal(game.getRole(), aExpectedRole, 'role should be ' + aExpectedRole);
  }

  var date = game.getTimestamp();
  if (aExpectedDayOfMonth && aExpectedDayOfMonth != DONTCARE) {
    equal(date.getDate(), aExpectedDayOfMonth, "Day of month should be " + aExpectedDayOfMonth);
  }

  if (aExpectedMonth && aExpectedMonth != DONTCARE) {
    equal(date.getMonth(), aExpectedMonth, "Month should be " + aExpectedMonth);
  }

  if (aExpectedYear && aExpectedYear != DONTCARE) {
    equal(date.getFullYear(), aExpectedYear, "Year should be " + aExpectedYear);
  }

  if (aExpectedHourOfDay && aExpectedHourOfDay != DONTCARE) {
    equal(date.getHours(), aExpectedHourOfDay, "Game should be at hour " + aExpectedHourOfDay + " of the day");
  }

  if (aExpectedMinuteOfHour && aExpectedMinuteOfHour != DONTCARE) {
    equal(date.getMinutes(), aExpectedMinuteOfHour, "Game should be at minute " + aExpectedMinuteOfHour + " of hour");
  }

  if (aExpectedSportLevel && aExpectedSportLevel != DONTCARE) {
    equal(game.getSportLevel(), aExpectedSportLevel, "Sport and level should be " + aExpectedSportLevel);
  }

  if (aExpectedSite && aExpectedSite != DONTCARE) {
    equal(game.getSite(), aExpectedSite, "Site should be '" + aExpectedSite + "'");
  }

  if (aExpectedHomeTeam && aExpectedHomeTeam != DONTCARE) {
    equal(game.getHomeTeam(), aExpectedHomeTeam, "Home team should be '" + aExpectedHomeTeam + "'");
  }

  if (aExpectedAwayTeam && aExpectedAwayTeam != DONTCARE) {
    equal(game.getAwayTeam(), aExpectedAwayTeam, "Away team should be '" + aExpectedAwayTeam + "'");
  }

  if (aExpectedLevel && aExpectedLevel != DONTCARE) {
    equal(game.getLevel(), aExpectedLevel, "Level should be '" + aExpectedLevel + "'");
  }

  if (aExpectScrimmage && aExpectScrimmage != DONTCARE) {
    if (aExpectTournament && aExpectTournament != DONTCARE) {
      ok(false, 'cannot have a game that is both a tournament game and a scrimmage');
    }

    equal(game.isScrimmage(), aExpectScrimmage, "Game is expected to be a scrimmage? " + aExpectScrimmage)
  }

  if (aExpectTournament && aExpectTournament != DONTCARE) {
    equal(game.isTournament(), aExpectTournament, "Game is expected to be part of a tournament? " + aExpectTournament)
  }
}

module("Basic Parse Testing", {
  setup: function() {
    this.testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013\n598 		Showcase 	Linesman 	4/26/2014 Sat 8:15 PM 	Hockey, 16U AAA 	Saint Louis Park, East 	TBA 	TBA 	$38.00";
    this.arbitrator = new Arbitrator(this.testString);
    this.columns = this.arbitrator.getColumns(0);
  },

  teardown: function() {
    // Clear local storage so we don't have any leftover preferences.
    localStorage.clear();
  }
});

test("Basic Parse Test", function() {
  // Assert
  ok(this.arbitrator != null, "arbitrator should be non-null");
  equal(this.arbitrator.getRows().length, 2, "there should be exactly two rows");
  equal(this.columns.length, 9, "row 0 should have 9 columns");
  equal(this.columns[0], '1111', "Column 0 should be the game number 1111");
  equal(this.columns[2], 'Referee 1', "Column 3 should indicate referee 1");
});

test("Basic Date Recognition", function() {
  // Assert
  equal(this.arbitrator.getGameById("1111").getTime12Hr(), "12:30pm");
  checkGame(this.arbitrator, 1111, DONTCARE, DONTCARE, 9, 10, 2013, 12, 30);
});

test("Basic Role Recognition", function() {
  // Assert
  checkGame(this.arbitrator, 1111, DONTCARE, Role.REFEREE);
  checkGame(this.arbitrator, 598, DONTCARE, Role.LINESMAN);
});

module("Complex Data Parsing", {
  setup: function(aAssert) {
    var dest = document.URL.substr(0,document.URL.lastIndexOf('/')) + '/fixtures/complexStatement.txt';

    // Setup context for callbacks
    var self = this;

    // Wait for ajax call to finish before proceeding with any tests
    stop();

    // This makes sure a 'syntax error' isn't thrown due to Firefox expecting valid
    // XML when the request comes back. It's mostly an error-suppression routine,
    // because the code keeps working even if it's not valid XML, it's just
    // annoying that it's reported as a syntax error in the console.
    $.ajaxSetup({'beforeSend': function(xhr){
      if (xhr.overrideMimeType)
          xhr.overrideMimeType("text/plain");
      }
    });

    $.ajax({
      url: dest,
      dataType: 'text'
    }).success(function(aData, aTextStatus, aRequest) {
      self.arbitrator = new Arbitrator(aData);
      start();
    }).error(function(aRequest, aErrorMessage, aErrorThrown) {
      ok(false, 'Encountered an error during ajax call: ' + aErrorThrown);
      start();
    });
  },

  teardown: function() {
    // Clear local storage so we don't have any leftover preferences.
    localStorage.clear();
  }
});

test("Tournament and Scrimmage Parsing", function() {
  equal(this.arbitrator.getNumGames(), 6, "there should be 6 games");

  // Check the characteristics of the first game.
  checkGame(this.arbitrator, 4073, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
            DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
            DONTCARE, false, true);

  // Check the characteristics of the second game.
  checkGame(this.arbitrator, 203, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
            DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
            DONTCARE, true);

  // Check the summary strings to make sure they are reasonable.
  var game1 = this.arbitrator.getGameById(4073);
  var expectedSS1 = "[106016] Referee (Squirt C Tournament)";
  var expectedSS2 = "[106016] Referee Scrimmage New Prague v Farmington (10U Girls B)";
  equal(game1.getSummaryString(), expectedSS1,
        "Summary string should be: '" + expectedSS1 + "'");

  var game2 = this.arbitrator.getGameById(203);
  equal(game2.getSummaryString(), expectedSS2,
        "Summary string should be: '" + expectedSS2 + "'");

});

test("Complex Statement Parsing", function() {
  equal(6, this.arbitrator.getNumGames(), 'there should be 6 games');

  // Test don't care terms.
  checkGame(this.arbitrator, 330);

  // Check the characteristics of the first game.
  checkGame(this.arbitrator, 330, '106016', Role.REFEREE, 8, 10, 2014, 9, 50,
            "D6, Scrimmage SC 60 MIn $27.50 Each", "Squirt C",
            "New Prague Community Center", "New Prague", "Dodge County Black");

  // Check the characteristics of the second game.
  checkGame(this.arbitrator, 339, '106016', Role.REFEREE, 8, 10, 2014, 18, 45,
            "D6, Scrimmage 10B 60 Min $27.50 Each", "10U Girls B",
            "Eden Prairie 3", "Eden Prairie Red", "Minnetonka Black");

  // Check the characteristics of the third game.
  checkGame(this.arbitrator, 3839, 'MinneapHO', Role.LINESMAN, 14, 10, 2014, 20, 10,
            "Hockey Boys, Varsity", "Varsity Boys", "St. Louis Park Recreation Center",
            "St Thomas Academy", "Minnetonka");

});

test("Note Game Start Time Truncation Regression Test", function() {
  var game = this.arbitrator.getGameById(5629);
  ok(game, "game should not be undefined");

  equal(game.getTime12Hr(), "11:00am");
});

test("JSON Output", function() {
  var game = this.arbitrator.getGameById(5629);
  ok(game, "game should not be undefined");

  var gameJson = game.getEventJSON();
  ok(gameJson, "game JSON should not be undefined");
  equal(game.getISOStartDate(), gameJson.start.dateTime);
  equal(game.getISOEndDate(), gameJson.end.dateTime);
  equal(game.getSite(), gameJson.location);
  equal(game.getSummaryString(), gameJson.summary);

  var notes = "Game starts at " + String(game.getTime12Hr()) + "\n\n" + "{ArbitratorHash: " + String(game.getHash()) + "}"
  equal(notes, gameJson.description);
});

module("Preference Testing", {
    setup: function() {
      // Set up and check preconditions
      this.prefStore = new PreferenceStore();
      ok(!this.prefStore.hasAliasedGroups(), 'should not have any aliased groups');
      ok(!this.prefStore.hasTimePreferences(), "time preferences should be empty");

      this.prefStore.addTimePreference(TimeType.PRIOR_TO_START, 61);
      this.prefStore.addTimePreference(TimeType.LENGTH_OF_GAME, 90);
      this.prefStore.addGroupAlias('106016', 'D6');

      this.testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013\n5422 		OSL 	Referee 2 	11/22/2014 Sat 8:40 PM 	OSL, Choice Tournament SL1 80 min 	Ken Yackel West Side 	Super League 1 	TBA 	$45.00 Accepted on 10/31/2014";
      this.arbitrator = new Arbitrator(this.testString);

      equal(this.arbitrator.getNumGames(), 2, 'should have 2 games');
    },

    teardown: function() {
      this.prefStore.removeAllGroupAliases();
      this.prefStore.removeTimePreference(TimeType.PRIOR_TO_START);
      this.prefStore.removeTimePreference(TimeType.LENGTH_OF_GAME);

      // Check post conditions
      ok(!this.prefStore.hasAliasedGroups(), 'should not have any aliased groups');
      ok(!this.prefStore.hasTimePreferences(), "time preferences should be empty");
    }
});

test("Group Alias Preferences", function() {
  // Assert
  checkGame(this.arbitrator, 1111, 'D6');
  ok(this.prefStore.hasAliasedGroups(), 'should have some aliased groups');
});

test("Time Preferences", function() {
  equal(this.prefStore.getTimePreference(TimeType.PRIOR_TO_START), 61, "should have set prior to start minutes to 61");

  var game = this.arbitrator.getGameById(1111);
  equal(game.getISOStartDate(), "2013-11-09T17:29:00.000Z", "ISO start date should be 61 minutes prior to game start");
  equal(game.getISOEndDate(), "2013-11-09T20:00:00.000Z", "ISO end date should be 90 minutes after start of game");
  ok(game.getEventJSON()['description'].contains("Game starts at 12:30pm"), 'the game should start at 12:30pm and this should be in the calendar event description');

  this.prefStore.removeTimePreference(TimeType.PRIOR_TO_START);
  this.prefStore.removeTimePreference(TimeType.LENGTH_OF_GAME);

  equal(game.getISOEndDate(), "2013-11-09T19:30:00.000Z", "game should default to 60 minute lengths");
  equal(game.getISOStartDate(), "2013-11-09T18:00:00.000Z", "game should default to 30 minute prior to start time");
});

test("Time Preference Regression Test", function() {
  var game = this.arbitrator.getGameById(5422);

  ok(game, "game should not be undefined");

  this.prefStore.addTimePreference(TimeType.PRIOR_TO_START, 60);
  this.prefStore.addTimePreference(TimeType.LENGTH_OF_GAME, 120);

  // Basic game checking
  checkGame(this.arbitrator, 5422, DONTCARE, DONTCARE, 22, 10, 2014, 20, 40);

  // Check ISO start and end times
  equal(game.getISOStartDate(), "2014-11-23T01:40:00.000Z", "Game should start on 11-23-14 at 2:40am UTC, minus 60 minutes for the time pref");
  equal(game.getISOEndDate(), "2014-11-23T04:40:00.000Z", "Game should end on 11-23-14 at 4:40am UTC");
});
