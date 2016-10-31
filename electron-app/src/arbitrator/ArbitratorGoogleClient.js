import { PreferenceStore } from './PreferenceStore'
import { ArbitratorConfig } from './ArbitratorConfig'

/**
 * Create a new instance of an ArbitratorGoogleClient object for use with Arbitrator.
 *
 * @param aOptionalCallback (Optional) A callback to be called when the
 *        ArbitratorGoogleClient has finished its initialization.
 */
export var ArbitratorGoogleClient = function(aOptionalCallback) {
  var that = this;
  require('google-client-api')(function (aGapi) {
    that.mGapi = aGapi;
    that.initialize(aOptionalCallback);
  });
}

ArbitratorGoogleClient.prototype = {
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

  populateUserId: function() {
    var that = this;
    this.mGapi.client.load('plus', 'v1', function() {
      var request = that.mGapi.client.plus.people.get({'userId' : 'me'});

      request.execute(function (aResponse) {
        var prefStore = new PreferenceStore();
        prefStore.setUserId(aResponse.id);
      });
    });
  },

  initialize: function(aOptionalCallback) {
      var arbiterConfig = ArbitratorConfig;
      var config = {
        'client_id': arbiterConfig.google_client_id,
        'scope': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile',
        'authuser': -1
      }

      var prefStore = new PreferenceStore();
      if (prefStore.getUserId()) {
        config.user_id = prefStore.getUserId();
      }

      var that = this;
      this.mGapi.auth.authorize(config, function(authResult) {
        if (authResult && !authResult.error) {
          that.populateCalendarList();
          that.populateUserId();

          if (aOptionalCallback) {
            aOptionalCallback();
          }
        }
      });
  }
};
