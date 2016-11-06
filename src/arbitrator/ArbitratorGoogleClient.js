import { ArbitratorConfig } from './ArbitratorConfig'
import * as google from 'googleapis'
import createWindow from '../helpers/window';
import { PreferenceSingleton, TimeType } from './PreferenceStore';
import { Game } from './Game';

// Specify default options to be used with all requests.
// google.options({ proxy: 'http://localhost:5555' });

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

  getClient: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      var prefStore = PreferenceSingleton.instance;
      var OAuth2 = google.auth.OAuth2;
      that.client = new OAuth2(
        ArbitratorConfig.google_client_id,
        ArbitratorConfig.google_client_secret,
        'urn:ietf:wg:oauth:2.0:oob' // Instruct google to return the auth code via the title
      );

      var tokens = prefStore.getAuthTokens();
      if (tokens) {
        that.client.setCredentials(tokens);
        resolve(that.client);
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
                  var prefStore = PreferenceSingleton.instance;
                  prefStore.setAuthTokens(tokens);
                  resolve(that.client);
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

  /**
   * Adjust a game that is already in Google Calendar to have new data.
   *
   * This is accomplished by removing the current event in Google Calendar and
   * adding a new event with the corresponding data. No checking is done to
   * determine if these two events represent the same game.
   *
   * @param aCalendarId The id of the calendar which should have the event.
   * @param aEvent The event data structure given from Google that should be
   *        deleted.
   * @param aGame The game data structure that has the new data.
   */
  adjustGameInCalendar: function(aCalendarId, aEvent, aGame) {
    console.log("Adjusting game in calendar...");
    var that = this;
    return new Promise((resolve, reject) => {
      that.getToken(() => {
        var cal = google.calendar({
          version: 'v3',
          auth: that.client
        });

        // First, delete the old event.
        cal.events.delete({
          'calendarId' : aCalendarId,
          'eventId' : aEvent.id
        }, function (err, result) {
            if (err) {
              reject(err);
            } else {
              // Now, submit the new event.
              return submitGameToCalendar(aCalendarId, aGame);
            }
        });
      });
    });
  },

  /**
   * Submits a game to Google Calendar using the javascript REST api.
   *
   * @param aCalendarId The id of the calendar which should have the event.
   * @param aGame The Game to submit to the calendar.
   */
  submitGameToCalendar: function(aCalendarId, aGame) {
    var that = this;
    return new Promise((resolve, reject) => {
      that.getClient().then((client) => {
        var eventToInsert = aGame.getEventJSON();

        var cal = google.calendar({
          version: 'v3',
          auth: client
        });

        cal.events.insert({
          'calendarId' : aCalendarId,
          'resource' : eventToInsert
        }, {}, function (err, result) {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        });
      });
    });
  },

  /**
   * Find a game within a given calendar.
   *
   * @param aCalendarId The google calendar id for the calendar which should be
   *        searched for events.
   * @param aGame The game that should be searched for within the calendar.
   * @param aCallback An object with two functions: foundMatchingEvent() and
   *        noMatchingEventFound(), representing logic to perform when an event
   *        was found or not found, respectively.
   */
  findGameInCalendar: function(aCalendarId, aGame) {
    return new Promise((resolve, reject) => {
      var that = this;
      that.getClient().then((oAuthClient) => {
        console.log("CLIENT:");
        console.log(oAuthClient);
        var cal = google.calendar({
          version: 'v3',
          auth: oAuthClient
        });

        console.log("Searching for game with hash: " + aGame.getHash());
        var searchString = "{ArbitratorHash: " + aGame.getHash() + "}";
        var req = cal.events.list({
          'calendarId' : aCalendarId
        }, {}, function (err, result) {
          if (err) {
            reject(err);
            return;
          }

          var results = result.items;
          var foundEvent = false;
          for (var i = 0; i < results.length; i++) {
            var calEvent = results[i];
            if (calEvent.description
                && calEvent.description.indexOf(searchString) > 0) {
                resolve(calEvent);
                return;
            }
          }

          if (!foundEvent) {
            resolve();
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
};
