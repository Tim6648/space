import { Entity } from './Entity.js';
import $ from './jquery.module.js';

export class Ship extends Entity {
  constructor({
    removeLife,
    getOverlappingBullet,
    removeBullet,
  }) {
    super({ tag: 'img' });
    this.el.attr('src', './images/ship.png');
    $('body').append(this.el);

    this.SPEED = 2;
    this.SHIP_IMAGE_WIDTH = 50;
    this.canFire = true;
    this.isAlive = true;

    this.removeLife = removeLife;
    this.getOverlappingBullet = getOverlappingBullet;
    this.removeBullet = removeBullet;

    this.spawn();
  }

  /**
   * init a ship
   */
  spawn() {
    this.isAlive = true;
    this.el.css('opacity', 1);
    this.setX(window.innerWidth / 2);
    this.setY(window.innerHeight - 80);
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    if (!this.isAlive) return;
    this.setX(this.x + this.SPEED);
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    if (!this.isAlive) return;
    this.setX(this.x - this.SPEED);
  }

  /**
   * Fires a bullet from the ship.
   *
   * @param {Object} createBullet - A function that creates a bullet.
   */
  fire({ createBullet }) {
    if (this.canFire && this.isAlive) {
      this.canFire = false;
      createBullet({
        x: this.x + this.SHIP_IMAGE_WIDTH / 2,
        y: this.y,
      });
      setTimeout(() => {
        this.canFire = true;
      }, 1000);
    }
  }

  /**
   * Kills the entity and performs the necessary cleanup operations.
   */
  kill() {
    this.isAlive = false;

    // init a new ship after 1 second
    setTimeout(() => {
      this.spawn();
    }, 1000);

    this.el.css('opacity', 0);
  }

  /**
   * Updates the state of the ship.
   */
  update() {
    const bullet = this.getOverlappingBullet(this);
    if (bullet && bullet.isAlien && this.isAlive) {
      // kill ship
      this.removeBullet(bullet);
      this.removeLife();
      this.kill();
    }
  }
}
