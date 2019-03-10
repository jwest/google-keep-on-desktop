let isWindowOpen = true;

function toggle(onOpen, onClose) {
  return () => {
    if (!isWindowOpen) {
        isWindowOpen = true;
        onOpen();
    } else {
        isWindowOpen = false;
        onClose();
    }
  };
}

module.exports = { toggleInit: toggle };