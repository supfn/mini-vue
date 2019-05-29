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
