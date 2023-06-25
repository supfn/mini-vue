import Dep from './Dep';

function observer(data) {
  if (data && typeof data === 'object') {
    return new Observer(data);
  }
}

// Observer: 数据观察者，对所有数据进行 defineReactive
// getter: 在数据获取时，收集依赖，创建订阅者Dep实例，并在其中添加观察者watcher
// setter: 在数据变更时，派发更新，及通知数据订阅者执行 dep.notify
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
