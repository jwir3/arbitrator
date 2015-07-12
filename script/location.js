var Location = function(aName, aAddress, aLatitude, aLongitude) {
  this.mName = aName;
  this.mAddress = aAddress;
  this.mLatitude = aLatitude;
  this.mLongitude = aLongitude;
  this.mCurrentLatitude = 0.0;
  this.mCurrentLongitude = 0.0;
  this._retrieveStartingPosition();
  this._populatePotentialMatchesFromName();
}

Location.prototype = {
  _retrieveStartingPosition: function() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(function(aPosition) {
      // Success
      this.mCurrentLatitude = aPosition.coords.latitude;
      this.mCurrentLongitude = aPosition.coords.longitude;
      console.log("Your current position is: " + this.mLatitude + ", " + this.mLongitude);
    }, function(aError) {
      // Error
      console.warn("An error occurred while trying to find your current position. You may need to allow Arbitrator to find your location. As a result, location queries will likely be much less accurate.");
    }, options);
  },

  _populatePotentialMatchesFromName: function() {
    var map = new google.maps.Map();
    var placesService = new google.maps.places.PlacesService(map);

    var placesServiceRequest = {
      keyword: this.mName,
      location: {lat: this.mCurrentLatitude, lng:this.mCurrentLongitude},
      types: ['park', 'school', 'stadium', 'university', ]
    }

    placesService.nearbySearch(placesServiceRequest, function(aResults, aStatus) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log("Place found: " + results[i].geometry.location);
        }
      } else {
        console.warn("An error occurred while trying to access the places search");
      }
    });
  }
}
