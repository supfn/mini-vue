import Compiler from './Compiler';
import observer from './Observer';

class MiniVue {
  constructor(options) {
    this.el = options.el;
    this.data = options.data;
    this.computed = options.computed;
    this.watch = options.watch;
    this.methods = options.methods;

    this._setProxy();
    this._initComputed();
    observer(this.data);
    new Compiler(this.el, this);
  }

  /**
   * Set the proxy for each property in the data object : vm.data.xx => vm.xx
   */
  _setProxy() {
    let _this = this;
    Object.keys(this.data).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: true,
        get() {
          return _this.data[key];
        },
        set(newVal) {
          _this.data[key] = newVal;
        }
      });
    });
  }

  _initComputed() {
    let _this = this;
    if (typeof this.computed === 'object') {
      Object.keys(this.computed).forEach(key => {
        let val = this.computed[key];
        if (typeof val === 'function') {
          Object.defineProperty(_this, key, {
            get: val,
          });
        } else if (typeof val === 'object') {
          Object.defineProperty(_this, key, {
            get: val.get,
            set: val.set
          });
        }
      });
    }
  }
}

window.MiniVue = MiniVue;
