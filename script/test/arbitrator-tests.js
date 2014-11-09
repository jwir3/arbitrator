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
