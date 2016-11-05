module("Preference Testing", {
    setup: function() {
      // Set up and check preconditions
      this.prefStore = new PreferenceStore();
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
