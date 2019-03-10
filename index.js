const { app, globalShortcut, Tray } = require('electron');
const settings = require('electron-settings');

const { TRAY_ICON } = require('./src/icon');
const { createWindow } = require('./src/window');
const { toggleInit } = require('./src/toggle');

const SHORTCUT_TOGGLE_DEFAULT = 'CommandOrControl+`';

let win = null;
let tray = null;

function focusOnCreateNote() {
  setTimeout(() => win.focus(), 0);
  win.webContents.sendInputEvent({
    type: 'keyDown',
    modifiers: [],
    keyCode: 'C',
  });
}

function onOpen() {
  tray.setHighlightMode('always');
  win.show();

  focusOnCreateNote();
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

  const SHORTCUT_TOGGLE = settings.get('shortcuts.toggle') || SHORTCUT_TOGGLE_DEFAULT;
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
