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
 * @param aExpectedSite The site of the game, as a string. This must represent
 *        EXACTLY how the online site has it listed. No resolution of lat/long
 *        is currently performed.
 * @param aExpectedHomeTeam The name of the home team of the game.
 * @param aExpectedAwayTeam The name of the away team of the game.
 */
function checkGame(aArbitrator, aGameId, aExpectedGroup, aExpectedRole,
                   aExpectedDayOfMonth, aExpectedMonth, aExpectedYear,
                   aExpectedHourOfDay, aExpectedMinuteOfHour,
                   aExpectedSportLevel, aExpectedSite, aExpectedHomeTeam,
                   aExpectedAwayTeam) {
  // Only the game id and arbitrator must be present. All other things can be
  // undefined, indicating a "don't care" term.
  ok(aArbitrator, 'aArbitrator cannot be undefined');
  ok(aGameId, 'aGameId cannot be undefined');

  var game = aArbitrator.getGameById(aGameId);
  ok(game, 'Game with id ' + aGameId + ' should exist in the map');

  if (aExpectedGroup && aExpectedGroup != DONTCARE) {
    equal(aExpectedGroup, game.getGroup(), 'group should be ' + aExpectedGroup);
  }

  if (aExpectedRole && aExpectedRole != DONTCARE) {
    equal(aExpectedRole, game.getRole(), 'role should be ' + aExpectedRole);
  }

  var date = game.getTimestamp();
  if (aExpectedDayOfMonth && aExpectedDayOfMonth != DONTCARE) {
    equal(aExpectedDayOfMonth, date.getDate(), "Day of month should be " + aExpectedDayOfMonth);
  }

  if (aExpectedMonth && aExpectedMonth != DONTCARE) {
    equal(aExpectedMonth, date.getMonth(), "Month should be " + aExpectedMonth);
  }

  if (aExpectedYear && aExpectedYear != DONTCARE) {
    equal(aExpectedYear, date.getFullYear(), '2013', "Year should be " + aExpectedYear);
  }

  if (aExpectedHourOfDay && aExpectedHourOfDay != DONTCARE) {
    equal(aExpectedHourOfDay, date.getHours(), "Game should be at hour " + aExpectedHourOfDay + " of the day");
  }

  if (aExpectedMinuteOfHour && aExpectedMinuteOfHour != DONTCARE) {
    equal(aExpectedMinuteOfHour, date.getMinutes(), "Game should be at minute " + aExpectedMinuteOfHour + " of hour");
  }

  if (aExpectedSportLevel && aExpectedSportLevel != DONTCARE) {
    equal(aExpectedSportLevel, game.getSportLevel(), "Sport and level should be " + aExpectedSportLevel);
  }

  if (aExpectedSite && aExpectedSite != DONTCARE) {
    equal(aExpectedSite, game.getSite(), "Site should be '" + aExpectedSite + "'");
  }

  if (aExpectedHomeTeam && aExpectedHomeTeam != DONTCARE) {
    equal(aExpectedHomeTeam, game.getHomeTeam(), "Home team should be '" + aExpectedHomeTeam + "'");
  }

  if (aExpectedAwayTeam && aExpectedAwayTeam != DONTCARE) {
    equal(aExpectedAwayTeam, game.getAwayTeam(), "Away team should be '" + aExpectedAwayTeam + "'");
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
              "D6, Scrimmage SC 60 MIn $27.50 Each",
              "New Prague Community Center", "New Prague", "Dodge County Black");

    // Check the characteristics of the second game.
    checkGame(arbitrator, 339, '106016', Role.REFEREE, 8, 10, 2014, 18, 45,
              "D6, Scrimmage 10B 60 Min $27.50 Each",
              "Eden Prairie 3", "Eden Prairie Red", "Minnetonka Black");

    // Check the characteristics of the third game.
    checkGame(arbitrator, 3839, 'MinneapHO', Role.LINESMAN, 14, 10, 2014, 20, 10,
              "Hockey Boys, Varsity", "St. Louis Park Recreation Center",
              "St Thomas Academy", "Minnetonka");

    start();
  }).error(function(aRequest, aErrorMessage, aErrorThrown) {
    ok(false, 'Encountered an error during ajax call: ' + aErrorThrown);
    start();
  });
});
