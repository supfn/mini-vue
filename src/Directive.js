import Watcher from "./Watcher";
import Updater from "./Updater";

// Directive set: contains common directives such as v-model and v-for
class Directive {

  static model(node, vm, exp, type) {
    this.bindData(node, vm, exp, type);
    node.addEventListener('input', e => {
      this.setVMData(vm, exp, e.target.value);
    });
  }

  static text(node, vm, exp, type) {
    this.bindData(node, vm, exp, 'text');
  }

  static html(node, vm, exp, type) {
    this.bindData(node, vm, exp, 'html');
  }

  static on(node, vm, exp, type, event) {
    node.addEventListener(event, vm.methods[exp].bind(vm));
  }

  static show(node, vm, exp, type) {
    this.bindData(node, vm, exp, type);
  }


  /**
   * @param {Node} node
   * @param {Object} vm
   * @param {string} exp
   * @param {string} type
   */
  static bindData(node, vm, exp, type) {
    let newVal = this.getVMData(vm, exp),
      updateView = Updater[type];

    updateView(node, exp, newVal);

    let watcher = new Watcher(vm, exp, (newVal, oldVal) => {
      updateView(node, exp, newVal);
      Object.keys(vm.watch).forEach(key => {
        if (key === exp) {
          vm.watch[key].call(vm, newVal, oldVal);
        }
      });
    });
    // console.log(watcher)
  }

  /**
   * @param {Object} vm
   * @param {string} exp
   */
  static getVMData(vm, exp) {
    return exp.trim().split('.').reduce((pre, cur) => pre[cur], vm);
  }

  /**
   * @param {Object} vm
   * @param {string} exp
   * @param newVal
   */
  static setVMData(vm, exp, newVal) {
    let expArr = exp.split('.'),
      val = vm.data;
    expArr.forEach((key, i) => {
      if (i === expArr.length - 1) {
        val[key] = newVal;
      } else {
        val = val[key];
      }
    });
  }
}

export default Directive;
