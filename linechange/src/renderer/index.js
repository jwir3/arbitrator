import $ from 'jquery'
import jQuery from 'jquery'
import { ipcRenderer, remote } from 'electron'
// import { UIManager } from '../arbitrator/UIManager'
import * as Strings from 'Strings';
import jetpack from 'fs-jetpack';
// import * as UIManager from 'UIManager'
import styles from 'styles/index.scss';

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

ipcRenderer.on('ready', (event, arg) => {
  var manager = new UIManager();
  manager.setVersion(appDir.read('package.json', 'json').version);
  manager.loadContent('main', Strings.appName, function() {
    manager.refreshPreferences();
    manager.setUIListeners();
  });
});
