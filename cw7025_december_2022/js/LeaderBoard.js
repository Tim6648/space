import { Entity } from "./Entity.js";

export class LeaderBoard extends Entity {
  constructor() {
    super({ tag: "div", className: "leader-board" });
    this.score = 0;
    this.setX((window.innerWidth * 1) / 3);
    this.setY((window.innerHeight * 1) / 3);
  }

  update(isEnd = false) {
    if (isEnd) {
      this.el.css("opacity", 1);
      this.refreshLeaderBoard();
    } else {
      this.el.css("opacity", 0);
    }
  }

  refreshLeaderBoard() {
    this.el.empty();
    const scoreStr = localStorage.getItem("scores");
    const scores = scoreStr ? JSON.parse(scoreStr) : [];
    if (scores.length > 0) {
      let sorted = scores.sort((a, b) => b - a).splice(0, 5);
      console.log('this is sorted score: ', sorted);
      for (let i = 0; i < sorted.length; i++) {
        this.el.append(`<p>#${i + 1} ${sorted[i]} Points</p>`);
      }
    } else {
      this.el.text("No Scores");
    }
  }
}
