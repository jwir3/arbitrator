var $ = require('jquery');

var domready = require('domready');
var UIManager = require('./UIManager');
var manager;
var ArbitratorGoogleClient = require('./arbitrator-google-client');
require('../../bower_components/magnific-popup/magnific-popup.jquery.json')

domready(function() {
  var googleClient = new ArbitratorGoogleClient(function() {
    manager = new UIManager();
    manager.loadContent('main', 'Arbitrator', function() {
      manager.refreshPreferences();
      manager.setUIListeners();
    });

    $('.ajax-popup-link').magnificPopup({
      type: 'ajax'
    });
  });
});
