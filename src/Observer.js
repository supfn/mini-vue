import Dep from './Dep';

function observer(data) {
  if (data && typeof data === 'object') {
    return new Observer(data);
  }
}

class Observer {
  constructor(data) {
    this.data = data;
    this.walk(data);
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      this.bindDescriptor(data, key, data[key]);
    });
  }

  bindDescriptor(data, key, value) {
    let childObj = observer(value),
      dep = new Dep(); // 一个属性对应一个Dep实例
    // console.log(dep);
    Object.defineProperty(data, key, {
      configurable: false,
      enumerable: true,
      get() {
        if (Dep.target) { // 在Watcher的getVMData时触发get，此时Dep.target为该Watcher实例
          dep.depend();
        }
        return value;
      },
      set(newVal) {
        if (newVal !== value) {
          value = newVal;
          childObj = observer(newVal);
          dep.notify();
        }
      }
    });
  }
}

export default observer;
