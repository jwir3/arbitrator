// function arbitrate() {
//   var scheduleText = document.getElementById('schedule').value;
//   var arb = new Arbitrator(scheduleText);
//   var calSelectionElement = document.getElementById('calendarList');
//   var selectedId = calSelectionElement[calSelectionElement.selectedIndex].id;
//   arb.adjustGamesOrSubmitToCalendar(selectedId);
//
//   updateGroupAliasPreferenceUI();
// }
//
// initialize();

var ArbitratorGoogleClient = require('./arbitrator-google-client');
var googleClient = new ArbitratorGoogleClient();
