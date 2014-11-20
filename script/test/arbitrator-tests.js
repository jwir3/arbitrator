// Polyfill for non-functional ECMAScript 5 Object.keys in FF 32
if (!Object.prototype.keys) {
  Object.prototype.keys = function() {
    if (this !== Object(this)) {
      throw new TypeError('Object.keys called on non-object');
    }

    var ret = [], p;
    for (p in this) {
      if (Object.prototype.hasOwnProperty.call(this, p)) {
        ret.push(p);
      }
    }

    return ret;
  }
}

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
    equal(date.getFullYear(), aExpectedYear, '2013', "Year should be " + aExpectedYear);
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

test("Arbitrator Parse Test", function() {
  // Arrange
  var testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013";

  // Act
  var arbitrator = new Arbitrator(testString);
  var cols = arbitrator.getColumns(0);

  // Assert
  ok(arbitrator != null, "arbitrator should be non-null");
  equal(arbitrator.getRows().length, 1, "there should be exactly one row");
  equal(cols.length, 9, "row 0 should have 9 columns");
  equal(cols[0], '1111', "Column 0 should be the game number 1111");
  equal(cols[2], 'Referee 1', "Column 3 should indicate referee 1");
});

test("Arbitrator Date Recognition", function() {
  // Arrange
  var testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013";
  var arbitrator = new Arbitrator(testString);

  // Act
  var date = arbitrator.getGameById("1111").getTimestamp();

  // Assert
  equal(arbitrator.getGameById("1111").getTime12Hr(), "12:30pm");
  checkGame(arbitrator, 1111, DONTCARE, DONTCARE, 9, 10, 2013, 12, 30);
});

test("Arbitrator Role Recognition", function() {
  // Arrange
  var testRef = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013";
  var linesString = "598 		Showcase 	Linesman 	4/26/2014 Sat 8:15 PM 	Hockey, 16U AAA 	Saint Louis Park, East 	TBA 	TBA 	$38.00";
  var arbitrator = new Arbitrator(testRef);
  var arbitrator2 = new Arbitrator(linesString);

  // Act
  // Assert
  checkGame(arbitrator, 1111, DONTCARE, Role.REFEREE);
  checkGame(arbitrator2, 598, DONTCARE, Role.LINESMAN);
});

test("Arbitrator Object.keys polyfill", function() {
  // Arrange
  var values = {a : 'a', b: 'b'};

  // Act
  var keys = values.keys();

  // Assert
  equal(2, keys.length, 'there should be two items in values.keys');
  ok(keys.indexOf('a') !== -1, 'a should be one of the keys');
  ok(keys.indexOf('b') !== -1, 'b should be one of the keys');
});

test("Arbitrator Complex Statement Parsing", function() {
  // Arrange
  var dest = document.URL.substr(0,document.URL.lastIndexOf('/')) + '/fixtures/complexStatement.txt';
  // Wait for the ajax call to finish before proceeding.
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

  // Act
  $.ajax({
    url: dest,
    dataType: 'text'
  }).success(function(aData, aTextStatus, aRequest) {
    // Assert

    var arbitrator = new Arbitrator(aData);
    equal(3, arbitrator.getNumGames(), 'there should be 3 games');

    // Test don't care terms.
    checkGame(arbitrator, 330);

    // Check the characteristics of the first game.
    checkGame(arbitrator, 330, '106016', Role.REFEREE, 8, 10, 2014, 9, 50,
              "D6, Scrimmage SC 60 MIn $27.50 Each", "Squirt C",
              "New Prague Community Center", "New Prague", "Dodge County Black");

    // Check the characteristics of the second game.
    checkGame(arbitrator, 339, '106016', Role.REFEREE, 8, 10, 2014, 18, 45,
              "D6, Scrimmage 10B 60 Min $27.50 Each", "10U Girls B",
              "Eden Prairie 3", "Eden Prairie Red", "Minnetonka Black");

    // Check the characteristics of the third game.
    checkGame(arbitrator, 3839, 'MinneapHO', Role.LINESMAN, 14, 10, 2014, 20, 10,
              "Hockey Boys, Varsity", "Varsity Boys", "St. Louis Park Recreation Center",
              "St Thomas Academy", "Minnetonka");

    start();
  }).error(function(aRequest, aErrorMessage, aErrorThrown) {
    ok(false, 'Encountered an error during ajax call: ' + aErrorThrown);
    start();
  });
});

test("Group aliases", function() {
  // Precondition
  ok(!Arbitrator.hasAliasedGroups(), 'should not have any aliased groups');

  // Arrange
  Arbitrator.addGroupAlias('106016', 'D6');

  var testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013";

  // Act
  var arbitrator = new Arbitrator(testString);

  // Assert
  checkGame(arbitrator, 1111, 'D6');
  ok(Arbitrator.hasAliasedGroups(), 'should have some aliased groups');
  equal(Arbitrator.getGroupAliases().keys().length, 1, 'should have 1 aliased group');

  // Tear down (so other tests don't use the aliases)
  Arbitrator.removeGroupAlias('106016');

  // Postcondition
  ok(!Arbitrator.hasAliasedGroups(), 'should not have any aliased groups');
});

test("Tournament and Scrimmage Parsing", function() {
  // Arrange
  var dest = document.URL.substr(0,document.URL.lastIndexOf('/')) + '/fixtures/tournamentScrimmage.txt';
  // Wait for the ajax call to finish before proceeding.
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

  // Act
  $.ajax({
    url: dest,
    dataType: 'text'
  }).success(function(aData, aTextStatus, aRequest) {
    // Assert

    var arbitrator = new Arbitrator(aData);
    equal(2, arbitrator.getNumGames(), 'there should be 2 games');

    // Check the characteristics of the first game.
    checkGame(arbitrator, 4073, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
              DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
              DONTCARE, false, true);

    // Check the characteristics of the second game.
    checkGame(arbitrator, 203, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
              DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
              DONTCARE, true);
    // Check the summary strings to make sure they are reasonable.
    var game1 = arbitrator.getGameById(4073);
    var expectedSS1 = "[106016] Referee (Squirt C Tournament)";
    var expectedSS2 = "[106016] Referee Scrimmage New Prague v Farmington (10U Girls B)";
    equal(game1.getSummaryString(), expectedSS1,
          "Summary string should be: '" + expectedSS1 + "'");

    var game2 = arbitrator.getGameById(203);
    equal(game2.getSummaryString(), expectedSS2,
          "Summary string should be: '" + expectedSS2 + "'");

    start();
  }).error(function(aRequest, aErrorMessage, aErrorThrown) {
    ok(false, 'Encountered an error during ajax call: ' + aErrorThrown);
    start();
  });
});

test("Identification String and Hash Computation", function() {
  var testData = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013";
  var arbitrator = new Arbitrator(testData);
  var game = arbitrator.getGameById(1111);
  ok(game, "game should not be undefined");

  var expectedIdString = "111110601612UGirlsBBloomingtonvMinnetonkaBlack";
  var expectedHash = CryptoJS.SHA1(expectedIdString).toString(CryptoJS.enc.Hex);
  equal(game.getIdentificationString(), expectedIdString, "identification string should be " + expectedIdString);
  equal(game.getHash(), expectedHash, "hash should be " + expectedHash);
});
