var Arbitrator = require('./arbitrator');
var ArbitratorGoogleClient = require('./arbitrator-google-client');

function arbitrate() {
  var scheduleText = document.getElementById('schedule').value;
  var arb = new Arbitrator(scheduleText);
  var calSelectionElement = document.getElementById('calendarList');
  var selectedId = calSelectionElement[calSelectionElement.selectedIndex].id;
  arb.adjustGamesOrSubmitToCalendar(selectedId);

  // updateGroupAliasPreferenceUI();
}

var googleClient = new ArbitratorGoogleClient(function() {
  var UIManager = require('./UIManager');
  var manager = new UIManager();

  manager.updatePreferencesFromStore();
  // updateGroupAliasPreferenceUI();
  // updateLocationPreferenceUI();
});
