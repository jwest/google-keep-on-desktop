const Application = require('spectron').Application;
const electronPath = require('electron');
const path = require('path');
const assert = require('assert');

describe('Application launch', function () {
  this.timeout(20000);

  beforeEach(() => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')],
      env: { 'ELECTRON_IS_DEV': true },
    });
    return this.app.start();
  });

  afterEach(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('opens a window', () => {
    return this.app.client.getWindowCount().then((count) => {
      assert.equal(count, 1);
    });
  });
});
