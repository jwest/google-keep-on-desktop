const { BrowserWindow } = require('electron');
const settings = require('electron-settings');
const contextMenu = require('electron-context-menu');
const windowStateKeeper = require('electron-window-state');
const isDev = require('electron-is-dev');

contextMenu({
	prepend: (params, browserWindow) => [{
		label: 'Rainbow',
		visible: params.mediaType === 'image'
	}]
});

const { DESKTOP_ICON } = require('./icon');

function createWindow () {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 612,
    defaultHeight: 600,
  });

  win = new BrowserWindow({ 
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 380,
    minHeight: 400,
    icon: DESKTOP_ICON,
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    visibleOnAllWorkspaces: true,
  });

  mainWindowState.manage(win);

  win.setAlwaysOnTop(true, 'floating');
  win.setVisibleOnAllWorkspaces(true);
  win.loadURL('https://keep.google.com/');

  if (settings.get('debug') || isDev) {
    win.webContents.openDevTools({ mode: 'undocked' });
  }

  win.webContents.on('did-finish-load', () => {
    let content = win.webContents;
    content.insertCSS('html body header[role="banner"] { padding-top: 12px; -webkit-app-region: drag; -webkit-user-select: none; }');
  });

  win.on('closed', () => {
    win = null;
  });

  return win;
}
  
module.exports = {
  createWindow,
}