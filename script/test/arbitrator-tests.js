function checkGame(aArbitrator, aGameId, aExpectedGroup, aExpectedRole,
                   aExpectedDayOfMonth, aExpectedMonth, aExpectedYear,
                   aExpectedHourOfDay, aExpectedMinuteOfHour) {
  ok(aArbitrator, 'aArbitrator cannot be null');

  var game = aArbitrator.getGameById(aGameId);
  ok(game, 'Game with id ' + aGameId + ' should exist in the map');

  equal(aExpectedGroup, game.getGroup(), 'group should be ' + aExpectedGroup);
  equal(aExpectedRole, game.getRole(), 'role should be ' + aExpectedRole);

  var date = game.getTimestamp();
  equal(aExpectedDayOfMonth, date.getDate(), "Day of month should be " + aExpectedDayOfMonth);
  equal(aExpectedMonth, date.getMonth(), "Month should be " + aExpectedMonth);
  equal(aExpectedYear, date.getFullYear(), '2013', "Year should be " + aExpectedYear);
  equal(aExpectedHourOfDay, date.getHours(), "Game should be at hour " + aExpectedHourOfDay + " of the day");
  equal(aExpectedMinuteOfHour, date.getMinutes(), "Game should be at minute " + aExpectedMinuteOfHour + " of hour");
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
  equal(date.getDate(), '9', "Day of month should be 9");
  equal(date.getMonth(), '10', "Month should be 10");
  equal(date.getFullYear(), '2013', "Year should be 2013");
  equal(date.getHours(), 12, "Game should be at hour 12pm");
  equal(date.getMinutes(), 30, "Game should be at minute 30 of hour");
});

test("Arbitrator Role Recognition", function() {
  // Arrange
  var testRef = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013";
  var linesString = "598 		Showcase 	Linesman 	4/26/2014 Sat 8:15 PM 	Hockey, 16U AAA 	Saint Louis Park, East 	TBA 	TBA 	$38.00";
  var arbitrator = new Arbitrator(testRef);
  var arbitrator2 = new Arbitrator(linesString);

  // Act
  var role = arbitrator.getRole(1111);
  var role2 = arbitrator2.getRole(598);

  // Assert
  equal(role, 0, "Role should be referee");
  equal(role2, 1, "Role should be linesman");
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

    // Check the characteristics of the first game.
    checkGame(arbitrator, 330, '106016', Role.REFEREE, 8, 10, 2014, 9, 50);

    // Check the characteristics of the second game.
    checkGame(arbitrator, 339, '106016', Role.REFEREE, 8, 10, 2014, 18, 45);

    // Check the characteristics of the third game.
    checkGame(arbitrator, 3839, 'MinneapHO', Role.LINESMAN, 14, 10, 2014, 20, 10);

    start();
  }).error(function(aRequest, aErrorMessage, aErrorThrown) {
    ok(false, 'Encountered an error during ajax call: ' + aErrorThrown);
    start();
  });
});
