var Place = function(aShortName, aName, aAddress) {
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

