import { GameAgeLevel } from '../arbitrator/GameAgeProfile';
import { expect, assert } from 'chai';

describe('Game Age and Level Parsing Functionality', () => {
  it('should be able to create GameAgeLevel objects', () => {
    var gal = new GameAgeLevel('.*', 'Bantam', 'A');
    expect(gal).to.not.be.null;
    expect(gal.getAge()).to.eq('Bantam');
    expect(gal.getLevel()).to.eq('A');
    expect(gal.matches("Hockey, Bantam A / AA")).to.eq(true);
  });

  it ('should recognize "D6, BB214 Tournament" as a Bantam level B2 game', () => {
    var gal = new GameAgeLevel('[Bantam|B](.*)[B2]', 'Bantam', 'B2');
    expect(gal).to.not.be.null;
    expect(gal.getAge()).to.eq('Bantam');
    expect(gal.getLevel()).to.eq('B2');
    expect(gal.matches("D6, BB214 Tournament")).to.eq(true);
  });

  it ('should not recognize "Hockey, Bantam A / AA" as a Bantam level B2 game', () => {
    var gal = new GameAgeLevel('[Bantam|B](.*)[B2]', 'Bantam', 'B2');
    expect(gal).to.not.be.null;
    expect(gal.getAge()).to.eq('Bantam');
    expect(gal.getLevel()).to.eq('B2');
    expect(gal.matches("Hockey, Bantam A / AA")).to.eq(false);
  });
});