import $ from "./jquery.module.js";

export class Entity {
  constructor({ tag = 'div', className = '' } = {}) {
    this.el = $('<' + tag + '>');
    $('body').append(this.el);
    this.el.addClass('entity ' + className);
  }

  setX(x) {
    this.x = x;
    this.el.css('left', `${this.x}px`);
  }

  setY(y) {
    this.y = y;
    this.el.css('top', `${this.y}px`);
  }

  remove() {
    this.el.remove();
    this.el = null;
  }
}
