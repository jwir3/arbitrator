var $ = require('jquery');

var domready = require('domready');
var UIManager = require('./UIManager');
var manager;
var ArbitratorGoogleClient = require('./arbitrator-google-client');

function init() {
  manager = new UIManager();
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
