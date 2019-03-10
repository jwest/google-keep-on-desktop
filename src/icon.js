const path = require('path');

const { nativeImage } = require('electron');

const icon = nativeImage.createFromPath(path.join(__dirname, 'resources/keep-icon.png'));

module.exports = {
    TRAY_ICON: icon.resize({ width: 32, height: 32, }),
    DESKTOP_ICON: icon,
}