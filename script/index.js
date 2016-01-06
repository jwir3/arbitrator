var $ = require('jquery');

var domready = require('domready');
var UIManager = require('./UIManager');
var manager = new UIManager();
var ArbitratorGoogleClient = require('./arbitrator-google-client');

function init() {
  $('#arbitrate-button').click(function () {
    manager.onArbitrate();
  });

  $('#logoutLink').click(function() {
    manager.logout();
  });
}

var googleClient = new ArbitratorGoogleClient(function() {
  manager.refreshPreferences();
  // updateLocationPreferenceUI();
});

// This next set of functions are callbacks that need to be globally accessible
// (thanks, browser code) :|
function addAlias(aGroupName) {
  manager.addAliasToPrefStore(aGroupName);
}

domready(function() {
  init();
});
