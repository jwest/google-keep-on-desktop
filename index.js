const { app, globalShortcut, Tray } = require('electron');
const settings = require('electron-settings');

const { TRAY_ICON } = require('./src/icon');
const { createWindow } = require('./src/window');
const { toggleInit } = require('./src/toggle');
const { menu } = require('./src/menu');

const SHORTCUT_TOGGLE_DEFAULT = 'CommandOrControl+`';
const SHORTCUT_PASTE_DEFAULT = 'CommandOrControl+Shift+`';

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

const paste = () => {
  toggle();

  setTimeout(() => {

    win.webContents.paste();

    setTimeout(() => {
      win.webContents.sendInputEvent({
        type: 'keyDown',
        modifiers: [],
        keyCode: 'Esc',
      });

      toggle();``
    }, 100);
  }, 100);
};

app.dock.hide();

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

  const SHORTCUT_PASTE = settings.get('shortcuts.paste') || SHORTCUT_PASTE_DEFAULT;
  if (!globalShortcut.register(SHORTCUT_PASTE, () => paste())) {
    console.log(`Shortcut ${SHORTCUT_PASTE} registration failed`);
  }

  win = createWindow();

  menu();
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
