import Dep from './Dep';

function observer(data) {
  if (data && typeof data === 'object') {
    return new Observer(data);
  }
}

// Observer: 数据观察者，对所有 Model 数据进行 defineReactive，即使所有 Model 数据在数据变更时，可以通知数据订阅者；
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
