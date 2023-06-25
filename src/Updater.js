import Watcher from "./Watcher";

// Updater: update dom, contains common directives such as v-model、v-for、v-text、v-show、v-on
class Updater {
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
    let newVal = this.getVMData(vm, exp);
    let updateDom = UpdateDOM[type];

    updateDom(node, exp, newVal);

    let watcher = new Watcher(vm, exp, (newVal, oldVal) => {
      updateDom(node, exp, newVal);
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

class UpdateDOM {
  static model(node, exp, newVal) {
    node.value = newVal;
  }

  static text(node, exp, newVal) {
    node.textContent = newVal;
  }

  static html(node, exp, newVal) {
    node.innerHTML = newVal;
  }

  static show(node, exp, newVal) {
    if (!newVal) {
      node.style.display = 'none';
    } else {
      node.style.display = '';
    }
  }
}


export default Updater;
