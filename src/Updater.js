class Updater {

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
