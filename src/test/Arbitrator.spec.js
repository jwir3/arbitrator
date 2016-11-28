import { Role, Game } from '../arbitrator/Game';
import { expect, assert } from 'chai';
import { env } from '../env';
import { Arbitrator } from '../arbitrator/Arbitrator';
import { DONTCARE, checkGame } from './CheckGame';
import * as moment from 'moment';
import { PreferenceSingleton, TimeType } from '../arbitrator/PreferenceStore'
import jetpack from 'fs-jetpack';

var singleGame = jetpack.read('src/test/fixtures/singleGame.txt');
var basicSchedule = jetpack.read('src/test/fixtures/basicSchedule.txt');
var complexSchedule = jetpack.read('src/test/fixtures/complexSchedule.txt');

describe("Arbitrator Translation Functionality", function () {
  it ("parses a basic string with two games", function() {
    var arbitrator = new Arbitrator(basicSchedule);

    expect(arbitrator).to.not.be.null;
    expect(arbitrator.getNumGames()).to.equal(2);
    expect(arbitrator.getGameById(1827)).to.be.null;
    var firstGame = arbitrator.getGameById(1111);
    expect(firstGame).to.not.be.null;

    // TODO: This is the old way of doing things. It would be very nice if we
    // could instead do something like:
    // expect(firstGame).to.be.a('game').withId(1111).withGroup('106016').withRole(Role.REFEREE)...
    checkGame(arbitrator, 1111, '106016', Role.REFEREE, 11, 9, 2013, 12, 30,
              '12U Girls B', 'Bloomington Ice Garden 1', 'Bloomington',
              'Minnetonka Black', false, false);
    checkGame(arbitrator, 598, 'Showcase', Role.LINESMAN, 4, 26, 2014, 20, 15,
              '16U Girls', 'Saint Louis Park, East', 'TBA', 'TBA', false, false);
  });

  it ("parses tournaments and scrimmages correctly", function() {
    var arbitrator = new Arbitrator(complexSchedule);
    expect(arbitrator.getNumGames()).to.equal(8);

    // Check the characteristics of the first game.
    checkGame(arbitrator, 4073, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
              DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
              false, true);

    // Check the characteristics of the second game.
    checkGame(arbitrator, 203, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE,
              DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE, DONTCARE, true);

              // Check the summary strings to make sure they are reasonable.
    var game1 = arbitrator.getGameById(4073);
    var expectedSS1 = "[106016] Referee (Squirt C Tournament)";
    expect(game1.getSummaryString()).to.equal(expectedSS1);

    var game2 = arbitrator.getGameById(203);
    var expectedSS2 = "[106016] Referee Scrimmage New Prague v Farmington (10U Girls B)";
    expect(game2.getSummaryString()).to.equal(expectedSS2);
  });

  it ("parses complex schedules with many games", function() {
    var arbitrator = new Arbitrator(complexSchedule);

    expect(arbitrator.getNumGames()).to.equal(8);

    // Test don't care terms.
    checkGame(arbitrator, 330);

    // Check the characteristics of the first game.
    checkGame(arbitrator, 330, '106016', Role.REFEREE, 11, 8, 2014, 9, 50,
              "Squirt C", "New Prague Community Center", "New Prague",
              "Dodge County Black");

    // Check the characteristics of the second game.
    checkGame(arbitrator, 339, '106016', Role.REFEREE, 11, 8, 2014, 18, 45,
              "10U Girls B", "Eden Prairie 3", "Eden Prairie Red",
              "Minnetonka Black");

    // Check the characteristics of the third game.
    checkGame(arbitrator, 3839, 'MinneapHO', Role.LINESMAN, 11, 14, 2014, 20, 10,
              "Varsity Boys", "St. Louis Park Recreation Center",
              "St Thomas Academy", "Minnetonka");
  });

  it ("does not truncate the start time", function() {
    var arbitrator = new Arbitrator(complexSchedule);
    var game = arbitrator.getGameById(5629);

    expect(game).to.be.ok;

    expect(game.getTime12Hr()).to.equal("11:00am");
  });

  it ("outputs JSON formatted for Google calendar", function() {
    var arbitrator = new Arbitrator(complexSchedule);

    var game = arbitrator.getGameById(5629);
    expect(game).to.be.ok;

    var gameJson = game.getEventJSON();
    expect(gameJson).to.be.ok;
    expect(game.getISOStartDate()).to.equal(gameJson.start.dateTime);
    expect(game.getISOEndDate()).to.equal(gameJson.end.dateTime);

    expect(game.getSite().getName()).to.equal(gameJson.location);
    expect(game.getSummaryString()).to.equal(gameJson.summary);

    var notes = "Game starts at " + String(game.getTime12Hr()) + "\n\n" + "{ArbitratorHash: " + String(game.getHash()) + "}"
    expect(notes).to.equal(gameJson.description);
  });

  it ("records no preparation time for consecutive games", function() {
    var arbitrator = new Arbitrator(complexSchedule);

    var game1 = arbitrator.getGameById(5694);
    var game2 = arbitrator.getGameById(5695);
    expect(game1).to.be.ok;
    expect(game2).to.be.ok;

    var expectedFirstStartTime = game1.getTimestamp().subtract(30, 'minutes');
    var expectedSecondStartTime = game2.getTimestamp();

    expect(game1.getISOStartDate()).to.equal(expectedFirstStartTime.toISOString());
    expect(game2.isConsecutiveGame()).to.be.ok;
    expect(game2.getISOStartDate()).to.equal(expectedSecondStartTime.toISOString());
  });

  it("intializes preferences to sane defaults", function() {
    var prefStore = PreferenceSingleton.instance;
    expect(prefStore.hasAliasedGroups()).to.be.falsy;
    expect(prefStore.hasTimePreferences()).to.be.falsy;
  });

  it ("recognizes time preferences set prior to parsing strings", function() {
    var prefStore = PreferenceSingleton.instance;

    prefStore.addTimePreference(TimeType.PRIOR_TO_START, 61);
    prefStore.addTimePreference(TimeType.LENGTH_OF_GAME, 90);
    prefStore.addGroupAlias('106016', 'D6');

    var arbitrator = new Arbitrator(basicSchedule);

    expect(arbitrator.getNumGames()).to.equal(2);
    expect(prefStore.getTimePreference(TimeType.PRIOR_TO_START)).to.equal(61);

    var game = arbitrator.getGameById(1111);
    expect(game.getISOStartDate()).to.equal(moment("11/9/2013 12:30 PM").subtract(61, 'minutes').toISOString());
    expect(game.getISOEndDate()).to.equal(moment("11/9/2013 12:30 PM").add(90, 'minutes').toISOString());
    assert(game.getEventJSON().description.indexOf("Game starts at 12:30pm") > -1, 'the game should start at 12:30pm and this should be in the calendar event description');

    prefStore.removeTimePreference(TimeType.PRIOR_TO_START);
    prefStore.removeTimePreference(TimeType.LENGTH_OF_GAME);

    expect(game.getISOEndDate()).to.equal("2013-11-09T19:30:00.000Z");
    expect(game.getISOStartDate()).to.equal("2013-11-09T18:00:00.000Z");
  });

  it ("outputs the correct start and end dates when end date is days in the future", function() {
    var prefStore = PreferenceSingleton.instance;
    var arbitrator = new Arbitrator(singleGame);
    var game = arbitrator.getGameById(5422);

    expect(game).to.be.ok;

    prefStore.addTimePreference(TimeType.PRIOR_TO_START, 60);
    prefStore.addTimePreference(TimeType.LENGTH_OF_GAME, 120);

    // Basic game checking
    checkGame(arbitrator, 5422, DONTCARE, DONTCARE, 11, 22, 2014, 20, 40);

    // Check ISO start and end times
    expect(game.getISOStartDate()).to.equal("2014-11-23T01:40:00.000Z");
    expect(game.getISOEndDate()).to.equal("2014-11-23T04:40:00.000Z");
  });

  it ("correctly recognizes group aliases", function () {
    var prefStore = PreferenceSingleton.instance;
    prefStore.addGroupAlias('106016', 'D6');

    var testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013\n598 		Showcase 	Linesman 	4/26/2014 Sat 8:15 PM 	Hockey, 16U AAA 	Saint Louis Park, East 	TBA 	TBA 	$38.00";
    var arbitrator = new Arbitrator(testString);
    checkGame(arbitrator, 1111, 'D6');

    expect(prefStore.hasAliasedGroups()).to.be.truthy;

    prefStore.removeGroupAlias('D6');
  });
});
