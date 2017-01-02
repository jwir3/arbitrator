import { PreferenceSingleton, TimeType } from '../arbitrator/PreferenceStore';
import { expect } from 'chai';
import { LeagueProfile, GameClassificationLevel } from '../arbitrator/LeagueProfile';
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

    var profile = new LeagueProfile('D6');
    profile.addGameClassificationLevel(new GameClassificationLevel('Bantam', 'B2', '[Bantam|B](.*)[B2]'));

    prefStore.addLeagueProfile(profile);

    expect(prefStore.getLeagueProfile('D6')).to.not.be.null;
    expect(prefStore.getLeagueProfile('D6').getNulevels()).to.eq(1);
    var GameClassificationLevelMatching = prefStore.getLeagueProfile('D6').findGameClassificationLevelMatching('D6, BB214 Tournament');
    expect(GameClassificationLevelMatching).to.not.be.null;
    expect(GameClassificationLevelMatching.getClassification()).to.eq('Bantam');
    expect(GameClassificationLevelMatching.getLevel()).to.eq('B2');
  });

  it ("should return an array of GameClassificationLevel objects that are sorted first by age then by level", function() {
    var prefStore = PreferenceSingleton.instance;
    prefStore._setLeagueProfiles(testProfiles.LeagueProfiles);

    var district6Profile = prefStore.getLeagueProfile('106016');
    expect(district6Profile).to.not.be.null;

    var levels = district6Profile.getLevels();

    expect(levels).to.have.lengthOf(5);
    expect(levels[0].getClassification()).to.eq('Squirt');
    expect(levels[0].getLevel()).to.eq('B');
    expect(levels[1].getClassification()).to.eq('Squirt');
    expect(levels[1].getLevel()).to.eq('C');
    expect(levels[2].getClassification()).to.eq('U10');
    expect(levels[3].getClassification()).to.eq('U12');
    expect(levels[4].getClassification()).to.eq('U15');

    prefStore._clearLeagueProfiles();
  });

  it ("is able to update an existing LeagueProfile to add new values", function() {
    var prefStore = PreferenceSingleton.instance;

    var profile = new LeagueProfile('D6');
    profile.addGameClassificationLevel(new GameClassificationLevel('Bantam', 'B2', '[Bantam|B](.*)[B2]'));

    prefStore.addLeagueProfile(profile);

    profile.addGameClassificationLevel(new GameClassificationLevel('Squirt', 'A', '.*'));
    prefStore.setLeagueProfile(profile);

    var retrieved = prefStore.getLeagueProfile('D6');
    expect(retrieved).to.not.be.null;
    expect(retrieved.getNulevels()).to.eq(2);
  });
});
