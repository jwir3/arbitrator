test("Arbitrator Parse Test", function() {
  // Arrange
  var testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013";

  // Act
  var arbitrator = new Arbitrator(testString);
  var cols = arbitrator.getColumns(0);

  // Assert
  ok(arbitrator != null, "arbitrator should be non-null");
  ok(arbitrator.getRows().length == 1, "there should be exactly one row");
  ok(cols.length == 9, "row 0 should have 9 columns. It has: " + cols.length + " columns");
  ok (cols[0] == '1111', "Column 0 should be the game number 1111. It was: " + cols[0]);
  ok (cols[2] == 'Referee 1', "Column 3 should indicate referee 1. It was: " + cols[3]);
});

test("Arbitrator Date Recognition", function() {
  // Arrange
  var testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013";
  var arbitrator = new Arbitrator(testString);

  // Act
  var date = arbitrator.getGameById("1111").getTimestamp();

  // Assert
  ok(date.getDate() == '9', "Day of month should be 9. Was: " + date.getDate());
  ok(date.getMonth() == '10', "Month should be 10. Was: " + date.getMonth());
  ok(date.getFullYear() == '2013', "Year should be 2013. Was: " + date.getFullYear());
  ok(date.getHours() == 12, "Game is at hour 12pm");
  ok(date.getMinutes() == 30, "Game is at minute 30 of hour");
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
