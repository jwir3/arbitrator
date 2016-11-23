// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, ipcMain} from 'electron';
import { fileMenuTemplate } from './menu/file_menu_template'
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';
import { UIManager } from './arbitrator/UIManager'
import { ArbitratorGoogleClient } from './arbitrator/ArbitratorGoogleClient'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow;
var arbiterWindow;

var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (process.platform == 'darwin') {
      menus.unshift(fileMenuTemplate);
    } else {
      menus = [fileMenuTemplate, editMenuTemplate];
    }

    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    var userDataPath = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
    setApplicationMenu();

    var mainWindow = createWindow('main', {
        width: 1000,
        height: 600
    });

    mainWindow.webContents.on('dom-ready', function() {
        var manager = new UIManager();
        var client = new ArbitratorGoogleClient();
        client.getClient()
              .then((client) => {
                  sendMessageToRenderer(mainWindow, client)
              })
              .catch((error) => {
                console.warn(error);
              });
    });

    mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (env.name === 'development') {
        mainWindow.openDevTools();
    }
});

app.on('before-quit', function() {
  if (arbiterWindow != null) {
    arbiterWindow.close();
  }
});

app.on('window-all-closed', function () {
  app.quit();
});

ipcMain.on('arbiter-window-opened', (window) => {
  arbiterWindow = window;
});

ipcMain.on('arbiter-window-closed', () => {
  arbiterWindow = null;
});

ipcMain.on('arbiter-page-loaded', (event, dom) => {
  if (arbiterWindow == null) {
    console.warn("Unable to communicate with ArbiterSports window. Something went wrong.");
    return;
  }

  event.sender.send('arbiter-document-received', dom);
  // arbiterWebContents.send('arbiter-document-received', dom);
});

function sendMessageToRenderer(window, message) {
    let contents = window.webContents;
    contents.send('ready', message);
}
