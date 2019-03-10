const { app, globalShortcut, Tray } = require('electron');

const { TRAY_ICON } = require('./src/icon');
const { createWindow } = require('./src/window');
const { toggleInit } = require('./src/toggle');

const SHORTCUT_TOGGLE = 'CommandOrControl+`';

let win = null;
let tray = null;

function onOpen() {
  tray.setHighlightMode('always');
  win.show();

  setTimeout(() => win.focus(), 0);

  win.webContents.send('show-window');
  win.webContents.sendInputEvent({ type: 'keyDown', modifiers: [], keyCode: 'C' });
}

function onClose() {
  tray.setHighlightMode('never');
  win.hide();
}

const toggle = toggleInit(onOpen, onClose);

app.on('ready', () => {
  try {
    tray = new Tray(TRAY_ICON);
    tray.setToolTip('Google Keep Desktop');
    tray.on('click', () => toggle());
  } catch(e) {
    console.log(e);
  }

  if (!globalShortcut.register(SHORTCUT_TOGGLE, () => toggle())) {
    console.log(`Shortcut ${SHORTCUT_TOGGLE} registration failed`);
  }

  win = createWindow();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    win = createWindow();
  }
});
