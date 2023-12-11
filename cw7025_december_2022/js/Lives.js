import { Entity } from './Entity.js';

export class Lives extends Entity {
  constructor() {
    super();
    this.lives = 3;
    this.setX(window.innerWidth * 2 /3);
    this.setY(20);
    this.refreshText();
  }

  removeLife() {
    this.lives--;
    this.refreshText();
  }

  refreshText() {
    if (this.lives > 0) {
      this.el.text(`Lives: ${new Array(this.lives).fill(`♡`).join(' ')}`);
    } else {
      this.el.text('Lives: ');
    }
  }
}
