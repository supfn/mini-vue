import Dep from './Dep';

// Watcher: 订阅者，订阅并收到所有 Model 变化的通知，执行对应的指令（表达式）绑定函数；
class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.depIds = {}; // 设定dep存储器
    this.oldVal = this.get(); // 保存旧值
  }

  get() {
    Dep.target = this;
    let value = this.getVMData();
    Dep.target = null;
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
