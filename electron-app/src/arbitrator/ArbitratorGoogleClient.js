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
  client: null,

  getToken: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      var prefStore = new PreferenceStore();
      var OAuth2 = google.auth.OAuth2;
      that.client = new OAuth2(
        ArbitratorConfig.google_client_id,
        ArbitratorConfig.google_client_secret,
        'urn:ietf:wg:oauth:2.0:oob' // Instruct google to return the auth code via the title
      );

      var tokens = prefStore.getAuthTokens();
      if (tokens) {
        that.client.setCredentials(tokens);
        resolve(tokens);
      } else {
        var scopes = [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/userinfo.profile'
        ];

        var url = that.client.generateAuthUrl({
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
              that.client.getToken(code, function (err, tokens) {
                // Now tokens contains an access_token and an optional refresh_token. Save them.
                if (!err) {
                  that.client.setCredentials(tokens);
                  var prefStore = new PreferenceStore();
                  prefStore.setAuthTokens(tokens);
                  resolve(tokens);
                  window.removeAllListeners('closed');
                  window.close();
                }
              });
            }
          });
        });
      }
    });
  },

  getCalendarList: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      var cal = google.calendar({
        version: 'v3',
        auth: that.client
      });

      cal.calendarList.list(null, null,
        function (err, result) {
          if (err) {
            reject(err);
          }

          resolve(result.items);
      });
    });
  },

  getUserId: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      var plus = google.plus({version: 'v1', auth: that.client});
      plus.people.get({'userId': 'me'}, function(err, result) {
        if (err) {
          reject(err);
        }

        resolve(result.id);
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
