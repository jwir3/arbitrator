module.exports = GoogleClient;

/**
 * Create a new instance of a GoogleClient object for use with Arbitrator.
 *
 * @param aOptionalCallback (Optional) A callback to be called when the GoogleClient
 *        has finished its initialization.
 */
function GoogleClient(aOptionalCallback) {
  var that = this;
  require('google-client-api')(function (aGapi) {
    that.mGapi = aGapi;
    that.initialize(aOptionalCallback);
  });
}

GoogleClient.prototype = {
  populateCalendarList: function() {
    var that = this;
    this.mGapi.client.load('calendar', 'v3', function() {
      var request = that.mGapi.client.calendar.calendarList.list({
      });

      request.execute(function(aResponse) {
        var $ = require('jquery');
        var selectEle = $('#calendarList');
        for (calendarIdx in aResponse.items) {
            var calendarItem = aResponse.items[calendarIdx];
            var listItem = $('<option></option>');
            listItem.attr('id', calendarItem.id);
            listItem.text(calendarItem.summary);
            selectEle.append(listItem);
        }
        selectEle.css('display', 'block');
      });
    });
  },

  initialize: function(aOptionalCallback) {
      var arbiterConfig = require('./config.js');
      var config = {
        'client_id': arbiterConfig.google_client_id,
        'scope': 'https://www.googleapis.com/auth/calendar',
        'authuser' : -1
      }

      var that = this;
      this.mGapi.auth.authorize(config, function(authResult) {
        if (authResult && !authResult.error) {
          that.populateCalendarList();

          if (aOptionalCallback) {
            aOptionalCallback();
          }
        }
      });
  }
};
