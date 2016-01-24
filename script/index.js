var $ = require('jquery');

var domready = require('domready');
var UIManager = require('./UIManager');
var manager;
var ArbitratorGoogleClient = require('./arbitrator-google-client');

domready(function() {
  var googleClient = new ArbitratorGoogleClient(function() {
    manager = new UIManager();
    manager.loadContent('main', 'Arbitrator', function() {
      manager.refreshPreferences();
      manager.setUIListeners();
    });
  });
});
