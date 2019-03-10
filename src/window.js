const { BrowserWindow } = require('electron');

const { DESKTOP_ICON } = require('./icon');

function createWindow () {
  win = new BrowserWindow({ 
    width: 612,
    height: 600,
    minWidth: 380,
    minHeight: 400,
    frame: false,
    icon: DESKTOP_ICON,
  });

  win.setAlwaysOnTop(true);
  win.setVisibleOnAllWorkspaces(true);
  win.loadURL('https://keep.google.com/');
  win.webContents.openDevTools({ mode: 'undocked' });

  win.webContents.on('did-finish-load', () => {
    let content = win.webContents;
    content.insertCSS('html body header[role="banner"] { top: 0px; }');
  });

  win.on('closed', () => {
    win = null;
  });

  return win;
}
  
module.exports = {
  createWindow,
}