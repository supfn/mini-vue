import Dep from './Dep';

// Watcher: 观察者，订阅 Dep 变化的通知，执行对应回调函数cb更新视图；
class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.depIds = {}; // 设定dep存储器
    this.oldVal = this.get(); // 保存旧值
  }

  get() {
    Dep.target = this;  // 将 Dep.target 指向自己
    let value = this.getVMData(); // 然后触发属性的 getter 添加监听
    Dep.target = null; // 最后将 Dep.target 置空
    return value;
  }

  getVMData() {
    return this.exp.trim().split('.').reduce((pre, cur) => pre[cur], this.vm);
  }

  /**
   * @param {Dep} dep - Created in observer.bindDescriptor
   */
  addDep(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      this.depIds[dep.id] = 1;
      dep.addSub(this);
    }
  }

  update() {
    let newVal = this.get(),
      oldVal = this.oldVal;
    this.oldVal = newVal;
    this.cb.call(this.vm, newVal, oldVal);
  }
}

export default Watcher;
