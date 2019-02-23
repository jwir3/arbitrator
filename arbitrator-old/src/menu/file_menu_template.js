import { app, BrowserWindow } from 'electron';

var fileMenuName = 'File';
if (process.platform == 'darwin') {
  fileMenuName = app.getName();
}

export var fileMenuTemplate = {
    label: fileMenuName,
    submenu: [{
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: function () {
            app.quit();
        }
    }]
};
