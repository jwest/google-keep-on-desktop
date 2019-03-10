const { BrowserWindow } = require('electron');
const settings = require('electron-settings');
const contextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');

contextMenu({
	prepend: (params, browserWindow) => [{
		label: 'Rainbow',
		// Only show it when right-clicking images
		visible: params.mediaType === 'image'
	}]
});


const { DESKTOP_ICON } = require('./icon');

function createWindow () {
  win = new BrowserWindow({ 
    width: 612,
    height: 600,
    minWidth: 380,
    minHeight: 400,
    // frame: false,
    icon: DESKTOP_ICON,
    titleBarStyle: 'hidden',
  });

  win.setAlwaysOnTop(true);
  win.setVisibleOnAllWorkspaces(true);
  win.loadURL('https://keep.google.com/');

  if (settings.get('debug') || isDev) {
    win.webContents.openDevTools({ mode: 'undocked' });
  }

  win.webContents.on('did-finish-load', () => {
    let content = win.webContents;
    content.insertCSS('html body header[role="banner"] { top: 12px; }');
  });

  win.on('closed', () => {
    win = null;
  });

  return win;
}
  
module.exports = {
  createWindow,
}