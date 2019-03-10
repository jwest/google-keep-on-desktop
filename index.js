const { app, globalShortcut, Menu, Tray } = require('electron');

const { TRAY_ICON } = require('./src/icon');
const { createWindow } = require('./src/window');
const { toggle } = require('./src/toggle');

const SHORTCUT_OPEN = 'CommandOrControl+`';

let win = null;
let tray = null;

function onOpen() {
  win.show();

  setTimeout(() => win.focus(), 0);

  win.webContents.send('show-window');
  win.webContents.sendInputEvent({ type: 'keyDown', modifiers: [], keyCode: 'C' });
}

function onClose() {
  win.hide();
}

app.on('ready', () => {
  try {
    tray = new Tray(TRAY_ICON);

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' },
    ]);

    tray.setToolTip('Google Keep Desktop');
    tray.setContextMenu(contextMenu);
  } catch(e) {
    console.log(e);
  }

  const ret = globalShortcut.register(SHORTCUT_OPEN, () => toggle(onOpen, onClose));

  if (!ret) {
    console.log('registration failed');
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
