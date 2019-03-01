import { app, Menu, ipcMain} from 'electron';
import { fileMenuTemplate } from 'menu/file_menu_template'
import { devMenuTemplate } from 'menu/dev_menu_template';
import { editMenuTemplate } from 'menu/edit_menu_template';
import createWindow from 'helpers/window';
import { UIManager } from 'arbitrator/UIManager'
import { ArbitratorGoogleClient } from 'arbitrator/ArbitratorGoogleClient'
import { BrowserWindow } from 'electron';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from 'env';

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

app.on('before-quit', () => {
  if (global.arbiterWindow) {
    global.arbiterWindow.close();
  }
});

app.on('ready', function () {
    setApplicationMenu();

    global.mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
    });

    global.mainWindow.webContents.on('dom-ready', function() {
        var manager = new UIManager();
        var client = new ArbitratorGoogleClient();
        client.getClient()
              .then((client) => {
                  sendMessageToRenderer(global.mainWindow, 'ready', client)
              })
              .catch((error) => {
                console.warn(error);
              });
    });

    global.mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (env.name === 'development') {
        global.mainWindow.openDevTools();
    }
});

app.on('window-all-closed', function () {
  app.quit();
});

// ipcMain.on('arbiter-window-opened', (window) => {
//   arbiterWindow = window;
// });

// ipcMain.on('arbiter-window-closed', () => {
//   arbiterWindow = null;
// });

ipcMain.on('arbiter-request-create-window', (event, aspAuth) => {
  global.arbiterWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      partition: 'persist:arbiterSports'
    }
  });

  if (aspAuth) {
    const cookie = {url: 'https://www1.arbitersports.com', name: '.ASPXAUTH', value: aspAuth}
    global.arbiterWindow.webContents.session.cookies.set(cookie, (error) => {
      if (error) {
        console.warn("Could not set authentication cookie for ArbiterSports. You will need to login again.");
      }
    });
  }

  global.arbiterWindow.loadURL('https://www1.arbitersports.com/Official/GameScheduleEdit.aspx');

  global.arbiterWindow.on('close', () => {
    if (event.sender) {
      event.sender.send('arbiter-connection-check-finished', false);
      event.sender.send('arbiter-window-closed');
    }
  });

  global.arbiterWindow.webContents.on('did-finish-load', () => {
    let aspAuth = '';
    global.arbiterWindow.webContents.session.cookies.get({}, (error, cookies) => {
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].name == ".ASPXAUTH") {
          aspAuth = cookies[i].value;
          // event.sender.send('arbiter-authenticated', aspAuth);
          event.sender.send('arbiter-authenticated', '');
        }
      }
    });

    // global.arbiterWindow.webContents.executeJavaScript(
    //   `
    //   var message = '';
    //   if ($('#ctl00_ContentHolder_pgeDefault_conDefault_dgAccounts').length) {
    //     message = 'account-selection'
    //   } else if (location.href.search('Dashboard.aspx') > 0) {
    //     message = 'dashboard';
    //   }
    //   require('electron').ipcRenderer.send('arbiter-page-loaded', message);
    //   `
    // );
  });
});

ipcMain.on('arbiter-request-destroy-window', (event, success) => {
  global.arbiterWindow.close();
  sendMessageToMainRenderer('arbiter-connection-check-finished', success);
});

ipcMain.on('arbiter-page-loaded', (event, page) => {
  if (page == 'account-selection') {
    // global.arbiterWindow.webContents.executeJavaScript(`
    //   $('#ctl00_ContentHolder_pgeDefault_conDefault_dgAccounts')
    //     .find('td:nth-child(3)')
    //     .each(function(ele) {
    //       if ($(this).text().toString().replace(/ /g, '').search('Official') == 1) {
    //         $(this).parent().click();
    //       }
    //     });
    // `);
  } else if (page == 'dashboard') {
    // global.arbiterWindow.webContents.executeJavaScript(`
    //   location.href='GameScheduleEdit.aspx';
    // `);
  }
});

function sendMessageToRenderer(window, channel, message) {
  let contents = window.webContents;
  contents.send(channel, message);
}

function sendMessageToMainRenderer(channel, message) {
  sendMessageToRenderer(global.mainWindow, channel, message);
}
