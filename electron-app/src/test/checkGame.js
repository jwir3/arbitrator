import { expect } from 'chai';

// Just a gibberish string to represent a "Don't Care" term.
export var DONTCARE = 'jahjsya76817261kaqysgagasva9121879aksahdfa612';

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
export var checkGame = function (aArbitrator, aGameId, aExpectedGroup,
                                 aExpectedRole, aExpectedMonth,
                                 aExpectedDayOfMonth, aExpectedYear,
                                 aExpectedHourOfDay, aExpectedMinuteOfHour,
                                 aExpectedLevel, aExpectedSite,
                                 aExpectedHomeTeam, aExpectedAwayTeam,
                                 aExpectScrimmage, aExpectTournament) {
  // Only the game id and arbitrator must be present. All other things can be
  // undefined, indicating a "don't care" term.
  expect(aArbitrator).to.be.ok;
  expect(aGameId).to.be.ok;

  var game = aArbitrator.getGameById(aGameId);
  expect(game).to.be.ok;

  if (aExpectedGroup && aExpectedGroup != DONTCARE) {
    expect(game.getGroup()).to.equal(aExpectedGroup);
  }

  if (aExpectedRole && aExpectedRole != DONTCARE) {
    expect(game.getRole()).to.equal(aExpectedRole);
  }

  var moment = game.getTimestamp();
  if (aExpectedMonth && aExpectedMonth != DONTCARE) {
    expect(moment.month()+1).to.equal(aExpectedMonth);
  }

  if (aExpectedDayOfMonth && aExpectedDayOfMonth != DONTCARE) {
    expect(moment.date()).to.equal(aExpectedDayOfMonth);
  }

  if (aExpectedYear && aExpectedYear != DONTCARE) {
    expect(moment.year()).to.equal(aExpectedYear);
  }

  if (aExpectedHourOfDay && aExpectedHourOfDay != DONTCARE) {
    expect(moment.hour()).to.equal(aExpectedHourOfDay);
  }

  if (aExpectedMinuteOfHour && aExpectedMinuteOfHour != DONTCARE) {
    expect(moment.minute()).to.equal(aExpectedMinuteOfHour);
  }

  if (aExpectedLevel && aExpectedLevel != DONTCARE) {
    expect(game.getLevel()).to.equal(aExpectedLevel);
  }

  if (aExpectedSite && aExpectedSite != DONTCARE) {
    expect(game.getSite().getName()).to.equal(aExpectedSite);
  }

  if (aExpectedHomeTeam && aExpectedHomeTeam != DONTCARE) {
    expect(game.getHomeTeam()).to.equal(aExpectedHomeTeam);
  }

  if (aExpectedAwayTeam && aExpectedAwayTeam != DONTCARE) {
    expect(game.getAwayTeam()).to.equal(aExpectedAwayTeam);
  }

  if (aExpectScrimmage && aExpectScrimmage != DONTCARE) {
    if (aExpectTournament && aExpectTournament != DONTCARE) {

      assert.fail(isExpectScrimmage, isExpectTournament, 'cannot have a game that is both a tournament game and a scrimmage');
    }

    expect(game.isScrimmage()).to.equal(aExpectScrimmage);
  }

  if (aExpectTournament && aExpectTournament != DONTCARE) {
    expect(game.isTournament()).to.equal(aExpectTournament);
  }
}
