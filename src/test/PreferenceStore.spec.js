import { PreferenceSingleton, TimeType } from '../arbitrator/PreferenceStore';
import { expect } from 'chai';

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
});
