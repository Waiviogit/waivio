import Cookies from 'js-cookie';
import Umarkets from './umarkets';
import Widgets from './widgets';

let instance = null;
let store = null;

class SingletonPlatform {
  constructor() {
    if (!instance) {
      instance = this;
    }
    if (!this._platform) {
      const platform = Cookies.get('platformName');
      this.setPlatformInstance(platform);
    }
    return instance;
  }
  initialize(_store) {
    store = _store;
    this._platform.initialize(_store);
  }
  get platform() {
    return this._platform;
  }
  set platform(value) {
    this.setPlatformInstance(value);
    this._platform.initialize(store);
  }
  setPlatformInstance(platform) {
    if (platform) {
      this._platform = new Umarkets();
    } else {
      this._platform = new Widgets();
    }
  }
  createWebSocketConnection() {
    this._platform.createWebSocketConnection();
  }
  closeWebSocketConnection() {
    this._platform.closeWebSocketConnection();
  }
}

export const singleton = new SingletonPlatform();
