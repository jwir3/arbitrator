/*
test("Arbitrator Parse Test", function() {
  // Arrange
  var testString = "4001 			Referee 2 	5/9/2014 Fri 5:40 PM 	OSL, Preview Challenge Cup Advance Mite 	Minnesota Made 1 	Adv Mite SE 	Adv Mite NW 	$39.00 Accepted on 3/31/2014";

  // Act
  var arbitrator = new Arbitrator(testString);
  var cols = arbitrator.getColumns(0);

  // Assert
  ok(arbitrator != null, "arbitrator should be non-null");
  ok(arbitrator.getRows().length == 1, "there should be exactly one row");
  ok(cols.length == 10, "row 0 should have 10 columns. It has: " + cols.length + " columns");
  ok (cols[0] == '4001', "Column 0 should be the game number 4001. It was: " + cols[0]);
  ok (cols[3] == 'Referee 2', "Column 3 should indicate referee 2. It was: " + cols[3]);
});
*/
/*
test("Arbitrator Date Recognition", function() {
  // Arrange
  var testString = "4001 			Referee 2 	5/9/2014 Fri 5:40 PM 	OSL, Preview Challenge Cup Advance Mite 	Minnesota Made 1 	Adv Mite SE 	Adv Mite NW 	$39.00 Accepted on 3/31/2014";
  var arbitrator = new Arbitrator(testString2);

  // Act
  var date = arbitrator.getDate(0);
  console.log("***** DEBUG_jwir3: Date is: " + date);

  // Assert
  ok(date.getDate() == '9', "Day of month should be 9. Was: " + date.getDate());
  ok(date.getMonth() == '4', "Month should be 4. Was: " + date.getMonth());
  ok(date.getFullYear() == '2014', "Year should be 2014. Was: " + date.getFullYear());
  ok(date.getHours() == 17, "Game is at hour 5pm");
  ok(date.getMinutes() == 40, "Game is at minute 40 of hour");
});
*/

test("Arbitrator Role Recognition", function() {
  // Arrange
  var testString = "4001 			Referee 2 	5/9/2014 Fri 5:40 PM 	OSL, Preview Challenge Cup Advance Mite 	Minnesota Made 1 	Adv Mite SE 	Adv Mite NW 	$39.00 Accepted on 3/31/2014";
  var linesString = "598 		Showcase 	Linesman 	4/26/2014 Sat 8:15 PM 	Hockey, 16U AAA 	Saint Louis Park, East 	TBA 	TBA 	$38.00";
  var arbitrator = new Arbitrator(testString);
  var arbitrator2 = new Arbitrator(linesString);

  // Act
  var role = arbitrator.getRole(0);
  var role2 = arbitrator2.getRole(0);

  // Assert
  equal(role, 0, "Role should be referee");
  equal(role2, 1, "Role should be linesman");
});
