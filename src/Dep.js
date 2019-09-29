// Dep: 消息订阅器，用于收集 Watcher , 数据变化时，通知订阅者进行更新；
class Dep {
  constructor() {
    this.id = Dep.id++;
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    let index = this.subs.indexOf(sub);
    if (index !== -1) {
      this.subs.splice(index, 1);
    }
  }

  notify() {
    this.subs.forEach(sub => sub.update());
  }

  depend() {
    Dep.target.addDep(this);
  }
}

Dep.target = null;
Dep.id = 0;

export default Dep;
