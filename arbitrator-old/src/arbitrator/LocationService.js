import { Client } from 'node-rest-client'
import { ArbitratorConfig } from './ArbitratorConfig'

export var LocationService = function () {
}

LocationService.prototype = {
  mCurrentLatitude: 0.0,
  mCurrentLongitude: 0.0,
  mGoogleMapsClient: require('@google/maps').createClient({
    key: ArbitratorConfig.google_api_key
  }),
  mDistanceCircle: null,

  /**
   * A replacement for navigator.geolocation.getCurrentPosition().
   *
   * It's still unclear why navigator.geolocation.getCurrentPosition doesn't
   * work within electron, but it's possible that it has something to do with:
   * https://github.com/electron/electron/issues/1376
   */
  _getCurrentPosition: function(callback) {
    var client = new Client();
      client.get('https://maps.googleapis.com/maps/api/browserlocation/json?browser=chromium&sensor=true', function(data) {
          if (data.location) {
            var position = {
                coords : {
                    latitude : data.location.lat,
                    longitude : data.location.lng
                }
            };
            callback(position);
          }
      });
  },

  /**
   * Use the Google Maps API to retrieve Google place predictions for a given
   * string query.
   *
   * @param query [string] The search term for the prediction query
   * @param callback [function(Array)] The function to call when results are
   *        available. These results are sent as an array to the callback.
   */
  getPredictionsForQuery: function(query, callback) {
    var self = this;
    self._getCurrentPosition(function(aPosition) {
      // Success
      self.mCurrentLatitude = aPosition.coords.latitude;
      self.mCurrentLongitude = aPosition.coords.longitude;
      self.mGoogleMapsClient.placesQueryAutoComplete({
        input: query,
        language: 'en',
        location: [self.mCurrentLatitude, self.mCurrentLongitude],
        radius: 5000
      }, function (error, response) {
        var results = [];
        var predictions = response.json.predictions;
        for (var i = 0; i < predictions.length; i++) {
          var nextPrediction = predictions[i];
          if (nextPrediction.types) {
            // We only want establishments and geocode types of places.
            if (nextPrediction.types.includes('establishment')
                || nextPrediction.types.includes('geocode')) {
                results.push(nextPrediction.description);
            }
          }
        }

        callback(results);
      });
    });
  }
}
