import { Role, Game } from '../arbitrator/Game';
import { expect } from 'chai';
import { env } from '../env';
import { Arbitrator } from '../arbitrator/Arbitrator';
import { DONTCARE, checkGame } from './checkGame';

describe("Arbitrator", function () {
  it ("parses a basic string with two games", function() {
    var testString = "1111 		106016 	Referee 1 	11/9/2013 Sat 12:30 PM 	D6, 12B 	Bloomington Ice Garden 1 	Bloomington 	Minnetonka Black 	$29.50  Accepted on 10/18/2013\n598 		Showcase 	Linesman 	4/26/2014 Sat 8:15 PM 	Hockey, 16U AAA 	Saint Louis Park, East 	TBA 	TBA 	$38.00";
    var arbitrator = new Arbitrator(testString);

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
});
