import Directive from './Directive';

// Compiler: 模板解析器，可对模板中的指令、表达式、属性(props)进行解析，为视图绑定相应的更新函数。
class Compiler {
  constructor(el, vm) {
    this.el = document.querySelector(el);
    this.vm = vm;

    this.fragment = this.nodeToFragment(this.el);

    this.compileNode(this.fragment);

    this.el.appendChild(this.fragment);
  }

  /**
   * @param {Node} node
   * @returns {DocumentFragment}
   */
  nodeToFragment(node) {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment
    let fragment = document.createDocumentFragment(),
      children = node.childNodes;
    Array.from(children).forEach(node => fragment.appendChild(node));
    return fragment;
  }

  /**
   * @param {Node} node
   */
  compileNode(node) {
    let childNodes = node.childNodes,
      reg = /{{(.*)}}/g;
    Array.from(childNodes).forEach(childNode => {
      let text = childNode.textContent;
      if (this.isElementNode(childNode)) {
        this.compileElementNode(childNode);
      } else if (this.isTextNode(childNode) && reg.test(text)) {
        this.compileTextNode(childNode);
      }
    });
  }

  /**
   * @param {Text} textNode
   */
  compileTextNode(textNode) {
    let tokens = this.compileTextContent(textNode.textContent),
      fragment = document.createDocumentFragment(),
      parent = textNode.parentNode;
    tokens.forEach(token => {
      let textNode;
      if (token.tag) {
        textNode = document.createTextNode("");
        Directive.text(textNode, this.vm, token.value);
      } else {
        textNode = document.createTextNode(token.value);
      }
      fragment.appendChild(textNode);
    });
    parent.replaceChild(fragment, textNode); // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/replaceChild
  }

  /**
   * @param {string} textContent
   * @returns {Array}
   */
  compileTextContent(textContent) {
    let mustacheReg = /{{(.*?)}}/g,
      lastIndex = 0,
      tokens = [],
      match, index, value;

    while (match = mustacheReg.exec(textContent)) {
      index = match.index;
      if (index > lastIndex) {
        tokens.push({
          value: textContent.slice(lastIndex, index),
          tag: false  
        });
      }
      // tag标识是模板变量还是常规字符串
      value = match[1];
      tokens.push({
        value,
        tag: true
      });
      lastIndex = index + match[0].length;
    }

    if (lastIndex < textContent.length) {
      tokens.push({
        value: textContent.slice(lastIndex),
        tag: false
      });
    }
    return tokens;
  }

  /**
   * @param {Element} elementNode
   */
  compileElementNode(elementNode) {
    let children = elementNode.childNodes,
      attrs = elementNode.attributes;
    Array.from(attrs).forEach(attr => {
      let name = attr.name, reg = /:/;
      if (this.isDirective(name)) {
        let exp = attr.value,
          type = name.substring(2),
          index, eventType;
        if (reg.test(type)) { // on:click
          index = reg.exec(type).index;
          eventType = type.substring(index + 1);
          type = type.substring(0, index);
        }
        Directive[type](elementNode, this.vm, exp, type, eventType);
      }
    });
    if (children && children.length > 0) {
      this.compileNode(elementNode);
    }
  }

  isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }

  // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType

  isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
  }

  isDirective(name) {
    return name.indexOf('v-') !== -1;
  }

  isEventDirective(dir) {
    return dir.indexOf('on') === 0;
  }
}

export default Compiler;
