/**
 * A Place consists of a name, a shorter name (the alias used within Arbiter to
 * identify the site), an address, and a sub-location name (possibly blank). The
 * address may be undefined if no address was specified for this Place.
 */
export var Place = function(aShortName, aName, aAddress, aSubLocationName) {
  this.mShortName = aShortName;
  this.mName = aName;
  this.mAddress = aAddress;
  this.mSubLocationName = aSubLocationName;
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
  },

  getSubLocationName: function() {
    return this.mSubLocationName;
  },

  hasSubLocation: function() {
    return this.getSubLocationName() != "";
  }
}
