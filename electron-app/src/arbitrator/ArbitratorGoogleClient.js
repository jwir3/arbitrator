import { PreferenceStore } from './PreferenceStore'
import { ArbitratorConfig } from './ArbitratorConfig'
import * as google from 'googleapis'
import createWindow from '../helpers/window';

/**
 * Create a new instance of an ArbitratorGoogleClient object for use with Arbitrator.
 *
 * @param aOptionalCallback (Optional) A callback to be called when the
 *        ArbitratorGoogleClient has finished its initialization.
 */
export var ArbitratorGoogleClient = function() {
}

ArbitratorGoogleClient.prototype = {
  mToken: null,

  getToken: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      var OAuth2 = google.auth.OAuth2;
      var oauth2Client = new OAuth2(
        ArbitratorConfig.google_client_id,
        ArbitratorConfig.google_client_secret,
        'urn:ietf:wg:oauth:2.0:oob' // Instruct google to return the auth code via the title
      );

      var scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.profile'
      ];

      var url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        scope: scopes
      });

      var window = createWindow('googleAuth', {width: 400, height:650});
      window.loadURL(url);

      window.on('page-title-updated', () => {
        setImmediate(() => {
          const title = window.getTitle();
          if (title.startsWith('Denied')) {
            reject(new Error(title.split(/[ =]/)[2]));
            window.removeAllListeners('closed');
            window.close();
          } else if (title.startsWith('Success')) {
            var code = title.split(/[ =]/)[2];
            oauth2Client.getToken(code, function (err, tokens) {
              // Now tokens contains an access_token and an optional refresh_token. Save them.
              if (!err) {
                oauth2Client.setCredentials(tokens);
                that.mToken = tokens.access_token;
                resolve(that.mToken);
                window.removeAllListeners('closed');
                window.close();
              }
            });
          }
        });
      });
    });
  },

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
        'client_secret': arbiterConfig.google_client_secret,
        'scope': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile',
        'authuser': -1
      }

      console.log(config);

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
