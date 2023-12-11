import { Entity } from './Entity.js';

export class Score extends Entity {
  constructor() {
    super()
    this.score = 0;
    this.setX(window.innerWidth * 1 / 3);
    this.setY(20);
    this.refreshText();
  }

  addToScore(amount) {
    this.score += amount;
    this.refreshText();
  }

  refreshText() {
    this.el.text(`Score: ${this.score}`);
  }

  resetScore() {
    this.score = 0;
    this.refreshText();
  }

  saveScore() {
    if (this.score === 0) return;
    const scoreStr = localStorage.getItem('scores');
    const scores = scoreStr ? JSON.parse(localStorage.getItem('scores')) : [];
    scores.push(this.score);
    localStorage.setItem('scores', JSON.stringify(scores));
  }
}
