const { app, globalShortcut } = require('electron');

const { createWindow } = require('./src/window');
const { toggle } = require('./src/toggle');

const SHORTCUT_OPEN = 'CommandOrControl+`';

app.dock.hide();

let win;

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
