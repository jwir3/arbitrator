import { LeagueProfile, GameClassificationLevel } from '../arbitrator/LeagueProfile';
import { expect, assert } from 'chai';

describe('Game Classification and Level Parsing Functionality', () => {
  it('should be able to create GameClassificationLevel objects', () => {
    var gal = new GameClassificationLevel('Bantam', 'A', '.*');
    expect(gal).to.not.be.null;
    expect(gal.getClassification()).to.eq('Bantam');
    expect(gal.getLevel()).to.eq('A');
    expect(gal.matches("Hockey, Bantam A / AA")).to.eq(true);
  });

  it ('should recognize "D6, BB214 Tournament" as a Bantam level B2 game', () => {
    var gal = new GameClassificationLevel('Bantam', 'B2', '[Bantam|B](.*)[B2]');
    expect(gal).to.not.be.null;
    expect(gal.getClassification()).to.eq('Bantam');
    expect(gal.getLevel()).to.eq('B2');
    expect(gal.matches("D6, BB214 Tournament")).to.eq(true);
  });

  it ('should not recognize "Hockey, Bantam A / AA" as a Bantam level B2 game', () => {
    var gal = new GameClassificationLevel('Bantam', 'B2', '[Bantam|B](.*)[B2]');
    expect(gal).to.not.be.null;
    expect(gal.getClassification()).to.eq('Bantam');
    expect(gal.getLevel()).to.eq('B2');
    expect(gal.matches("Hockey, Bantam A / AA")).to.eq(false);
  });

  it ('should be able to remove GameClassificationLevel objects from a LeagueProfile', function() {
    var gal1 = new GameClassificationLevel('Bantam', 'A', '.*');
    var gal2 = new GameClassificationLevel('[Bantam|B](.*)[B2]', 'Bantam', 'B2');
    var gameProfile = new LeagueProfile('dontcare');
    gameProfile.addGameClassificationLevel(gal1);
    gameProfile.addGameClassificationLevel(gal2);

    expect(gameProfile.getLevels()).to.have.lengthOf(2);

    gameProfile.removeGameClassificationLevel(gal2);

    expect(gameProfile.getLevels()).to.have.lengthOf(1);
  });
});
