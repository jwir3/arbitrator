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
