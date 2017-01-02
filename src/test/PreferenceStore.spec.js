import { PreferenceSingleton, TimeType } from '../arbitrator/PreferenceStore';
import { expect } from 'chai';
import { GameAgeProfile, GameAgeLevel } from '../arbitrator/GameAgeProfile';
import jetpack from 'fs-jetpack';

var testProfiles = jetpack.read('src/test/fixtures/testProfiles.json', 'json');

describe("Preference Storage and Retrieval", function () {
  it ("is able to retrieve an instance of the PreferenceStore", function() {
    var prefStore = PreferenceSingleton.instance;
    expect(prefStore).to.be.ok;
  });

  it ("is able to set a preference in a single instance and retrieve it in another", function() {
    var prefStore1 = PreferenceSingleton.instance;
    var prefStore2 = PreferenceSingleton.instance;

    prefStore1.addTimePreference(TimeType.PRIOR_TO_START, 61);

    expect(prefStore2.getTimePreference(TimeType.PRIOR_TO_START)).to.equal(61);
  });

  it ("is able to add a new game age profile and subsequently retrieve it", function() {
    var prefStore = PreferenceSingleton.instance;

    var profile = new GameAgeProfile('D6');
    profile.addGameAgeLevel(new GameAgeLevel('Bantam', 'B2', '[Bantam|B](.*)[B2]'));

    prefStore.addGameAgeProfile(profile);

    expect(prefStore.getGameAgeProfile('D6')).to.not.be.null;
    expect(prefStore.getGameAgeProfile('D6').getNumLevels()).to.eq(1);
    var gameAgeLevelMatching = prefStore.getGameAgeProfile('D6').findGameAgeLevelMatching('D6, BB214 Tournament');
    expect(gameAgeLevelMatching).to.not.be.null;
    expect(gameAgeLevelMatching.getAge()).to.eq('Bantam');
    expect(gameAgeLevelMatching.getLevel()).to.eq('B2');
  });

  it ("should return an array of GameAgeLevel objects that are sorted first by age then by level", function() {
    var prefStore = PreferenceSingleton.instance;
    prefStore._setGameAgeProfiles(testProfiles.gameAgeProfiles);

    var district6Profile = prefStore.getGameAgeProfile('106016');
    expect(district6Profile).to.not.be.null;

    var levels = district6Profile.getLevels();

    expect(levels).to.have.lengthOf(5);
    expect(levels[0].getAge()).to.eq('Squirt');
    expect(levels[0].getLevel()).to.eq('B');
    expect(levels[1].getAge()).to.eq('Squirt');
    expect(levels[1].getLevel()).to.eq('C');
    expect(levels[2].getAge()).to.eq('U10');
    expect(levels[3].getAge()).to.eq('U12');
    expect(levels[4].getAge()).to.eq('U15');

    prefStore._clearGameAgeProfiles();
  });

  it ("is able to update an existing GameAgeProfile to add new values", function() {
    var prefStore = PreferenceSingleton.instance;

    var profile = new GameAgeProfile('D6');
    profile.addGameAgeLevel(new GameAgeLevel('Bantam', 'B2', '[Bantam|B](.*)[B2]'));

    prefStore.addGameAgeProfile(profile);

    profile.addGameAgeLevel(new GameAgeLevel('Squirt', 'A', '.*'));
    prefStore.setGameAgeProfile(profile);

    var retrieved = prefStore.getGameAgeProfile('D6');
    expect(retrieved).to.not.be.null;
    expect(retrieved.getNumLevels()).to.eq(2);
  });
});
