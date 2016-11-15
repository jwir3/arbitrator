// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
// console.log('The author of this app is:', appDir.read('package.json', 'json').author);
//
// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('greet').innerHTML = greet();
//     document.getElementById('platform-info').innerHTML = os.platform();
//     document.getElementById('env-name').innerHTML = env.name;
// });

import $ from 'jquery'
import jQuery from 'jquery'
import { ipcRenderer, remote } from 'electron'
import { UIManager } from './arbitrator/UIManager'

import jetpack from 'fs-jetpack'; // module loaded from npm

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

console.log('The author of this app is:', appDir.read('package.json', 'json').author);

ipcRenderer.on('ready', (event, arg) => {
  var manager = new UIManager();
  manager.setVersion(appDir.read('package.json', 'json').version);
  manager.loadContent('main', 'Arbitrator', function() {
    manager.refreshPreferences();
    manager.setUIListeners();
  });
});
