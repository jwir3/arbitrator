var $ = require('jquery');

var domready = require('domready');
var UIManager = require('./UIManager');
var manager;

domready(function() {
  var manager = new UIManager();
  manager.refreshGoogleClient(function(aGoogleClient) {
    manager.loadContent('main', 'Arbitrator', function() {
      manager.refreshPreferences();
      manager.setUIListeners();
    });
  });
});
