var Location = function(aDomElement) {
  this.mCurrentLatitude = 0.0;
  this.mCurrentLongitude = 0.0;
  this.enableAutoCompleteForElement(aDomElement);
  this._retrieveStartingPosition();
}

Location.prototype = {
  _retrieveStartingPosition: function() {
    var self = this;
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(function(aPosition) {
      // Success
      this.mCurrentLatitude = aPosition.coords.latitude;
      this.mCurrentLongitude = aPosition.coords.longitude;
      var geolocation = new google.maps.LatLng(this.mCurrentLatitude,
                                               this.mCurrentLongitude);
      var distanceCircle = new google.maps.Circle({
        center: geolocation,
        radius: aPosition.coords.accuracy
      });
      self.autocomplete.setBounds(distanceCircle.getBounds());

    }, function(aError) {
      // Error
      console.warn("An error occurred while trying to find your current position. You may need to allow Arbitrator to find your location. As a result, location queries will likely be much less accurate.");
    }, options);
  },

  enableAutoCompleteForElement: function(aDomElement) {
    var self = this;

    // The geocode type restricts the search to geographical location types.
    this.autocomplete = new google.maps.places.Autocomplete(aDomElement,
                                                            { types: ['geocode'] });
    google.maps.event.addListener(self.autocomplete, 'place_changed', function() {
      // When the user selects an address from the dropdown, this will fire.
      var place = self.autocomplete.getPlace();
    });
  }
}
