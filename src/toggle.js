let isWindowOpen = true;

function toggle(onOpen, onClose) {
  if (!isWindowOpen) {
    onOpen();

    isWindowOpen = true;
  } else {
    onClose();

    isWindowOpen = false;
  }
}

module.exports = { toggle };