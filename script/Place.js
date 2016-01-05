module.exports = Place;

/**
 * A Place consists of a name, a shorter name (the alias used within Arbiter to
 * identify the site), and an address. The address may be undefined if no
 * address was specified for this Place.
 */
function Place(aShortName, aName, aAddress) {
  this.mShortName = aShortName;
  this.mName = aName;
  this.mAddress = aAddress;
}

Place.prototype = {
  getShortName: function() {
    return this.mShortName;
  },

  getName: function() {
    return this.mName;
  },

  getAddress: function() {
    return this.mAddress;
  }
}
