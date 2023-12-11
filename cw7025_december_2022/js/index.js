import { Ship } from "./Ship.js";
import { Bullet } from "./Bullet.js";
import { Alien } from "./Alien.js";
import { Score } from "./Score.js";
import { Lives } from "./Lives.js";
import { LeaderBoard } from "./LeaderBoard.js";
import $ from "./jquery.module.js";

const ALIEN_ROWS = 5;
const ALIEN_COLS = 9;

var isEnd = false;
var gameLoop;
var bulletLoop;

const scoreGui = new Score();
const livesGui = new Lives();
const boardGui = new LeaderBoard();

// Keys for control
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  [" "]: false,
};

// event listener for key control
$("body").on("keydown", (event) => {
  if (event.key === "Enter" && isEnd) {
    // restart game
    isEnd = false;
    boardGui.update(isEnd);
    startGame();
  } else {
    keys[event.key] = true;
  }
});

$("body").on("keyup", (event) => {
  if (event.key === "Enter") {
  } else {
    keys[event.key] = false;
  }
});

// init for random bullets from aliens
let bullets = [];

/**
 * Removes the specified alien from the aliens array and the aliensGrid.
 */
const removeAlien = (alien) => {
  aliens.splice(aliens.indexOf(alien), 1);
  alien.remove();

  for (let row = 0; row < aliensGrid.length; row++) {
    for (let col = 0; col < aliensGrid.length; col++) {
      if (aliensGrid[row][col] === alien) {
        aliensGrid[row][col] = null;
      }
    }
  }
};

// remove bullet when it get out of the bound of screen
const removeBullet = (bullet) => {
  bullets.splice(bullets.indexOf(bullet), 1);
  bullet.remove();
};

// check if two entities are overlapping
const isOverlapping = (entity1, entity2) => {
  const rect1 = entity1.el.clientRect();
  const rect2 = entity2.el.clientRect();
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
};

// get the overlapping bullet
const getOverlappingBullet = (entity) => {
  for (let bullet of bullets) {
    if (isOverlapping(entity, bullet)) {
      return bullet;
    }
  }
  return null;
};

// init a new Ship
const ship = new Ship({
  removeLife: () => {
    livesGui.removeLife();
    if (livesGui.lives === 0) {
      isEnd = true;

      endGame();
    }
  },
  removeBullet,
  getOverlappingBullet,
});

let aliens = [];
let aliensGrid = [];

function initAliens() {
  // init aliens
  for (let row = 0; row < ALIEN_ROWS; row++) {
    const aliensCol = [];
    for (let col = 0; col < ALIEN_COLS; col++) {
      const alien = new Alien({
        x: col * 60 + 120,
        y: row * 60 + 50,
        getOverlappingBullet,
        removeAlien,
        removeBullet,
        addToScore: (amount) => scoreGui.addToScore(amount),
      });
      aliens.push(alien);
      aliensCol.push(alien);
    }
    aliensGrid.push(aliensCol);
  }
}

/**
 * Retrieves the bottom aliens from the aliens grid.
 */
const getBottomAliens = () => {
  const bottomAliens = [];
  for (let col = 0; col < ALIEN_COLS; col++) {
    for (let row = ALIEN_ROWS - 1; row >= 0; row--) {
      if (aliensGrid[row][col]) {
        bottomAliens.push(aliensGrid[row][col]);
        break;
      }
    }
  }
  return bottomAliens;
};

/**
 * Returns a random alien from the given list.
 */
const getRandomAlien = (aliensList) => {
  return aliensList[parseInt(Math.random() * aliensList.length)];
};

/**
 * Generates a bullet fired by a random alien.
 */
const aliensFireBullet = () => {
  const bottomAliens = getBottomAliens();
  const randomAlien = getRandomAlien(bottomAliens);
  createBullet({
    x: randomAlien.x + 15,
    y: randomAlien.y + 33,
    isAlien: true,
  });
};

/**
 * Returns the leftmost alien from the given array of aliens.
 */
const getLeftMostAlien = () => {
  if (aliens.length > 0) {
    return aliens.reduce((minimumAlien, currentAlien) => {
      return currentAlien.x < minimumAlien.x ? currentAlien : minimumAlien;
    });
  } else {
    return null;
  }
};

/**
 * Returns the rightmost alien from the given array of aliens.
 */
const getRightMostAlien = () => {
  if (aliens.length > 0) {
    return aliens.reduce((maximumAlien, currentAlien) => {
      return currentAlien.x > maximumAlien.x ? currentAlien : maximumAlien;
    });
  } else {
    return null;
  }
};

/**
 * Creates a bullet and adds it to the bullets array.
 *
 * @param {Object} params - The parameters for creating the bullet.
 * @param {number} params.x - The x-coordinate of the bullet.
 * @param {number} params.y - The y-coordinate of the bullet.
 * @param {boolean} [params.isAlien=false] - Indicates whether the bullet is from an alien.
 */
const createBullet = ({ x, y, isAlien = false }) => {
  bullets.push(
    new Bullet({
      x,
      y,
      isAlien,
    })
  );
};

/**
 * Updates the game state based on user input and other factors.
 * Moves the ship right if the ArrowRight key is pressed and the ship is not at the right edge of the screen.
 * Moves the ship left if the ArrowLeft key is pressed and the ship is not at the left edge of the screen.
 * Fires a bullet if the space key is pressed.
 * Updates the ship's position.
 * Updates the position of each bullet and removes any bullets that have reached the top of the screen.
 * Updates the position of each alien.
 * If the leftmost alien's x-coordinate is less than 30, sets the direction of all aliens to right and moves them down.
 * If the rightmost alien's x-coordinate is greater than the width of the screen minus 60, sets the direction of all aliens to left and moves them down.
 *
 */
const update = () => {
  if (
    keys["ArrowRight"] &&
    ship.x < window.innerWidth - ship.SHIP_IMAGE_WIDTH
  ) {
    ship.moveRight();
  } else if (keys["ArrowLeft"] && ship.x > 0) {
    ship.moveLeft();
  }

  if (keys[" "]) {
    // create a bullet
    ship.fire({
      createBullet,
    });
  }

  ship.update();

  bullets.forEach((bullet) => {
    bullet.update();

    if (bullet.y < 0) {
      bullet.remove();
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  });

  aliens.forEach((alien) => {
    alien.update();
  });

  const leftMostAlien = getLeftMostAlien();
  if (leftMostAlien && leftMostAlien.x < 30) {
    if (aliens.length > 0) {
      aliens.forEach((alien) => {
        alien.setDirectionRight();
        alien.moveDown();
      });
    }
  }

  const rightMostAlien = getRightMostAlien();
  if (rightMostAlien && rightMostAlien.x > window.innerWidth - 60) {
    if (aliens.length > 0) {
      aliens.forEach((alien) => {
        alien.setDirectionLeft();
        alien.moveDown();
      });
    }
  }
};

function startGame() {
  initAliens();
  livesGui.lives = 3;
  livesGui.refreshText();
  scoreGui.resetScore();
  // start update all elements of the game, with 20ms interval
  gameLoop = setInterval(update, 20);
  // start alien random bullet animation
  bulletLoop = setInterval(aliensFireBullet, 1500);
  boardGui.update(isEnd);
}

function endGame() {
  // start update all elements of the game, with 20ms interval
  clearInterval(gameLoop);
  gameLoop = null;
  clearInterval(bulletLoop);
  bulletLoop = null;
  // TODO: remove all aliens and bullets and ship
  aliens.forEach((alien) => {
    alien.remove();
  });
  bullets.forEach((bullet) => {
    bullet.remove();
  });
  bullets = [];
  aliens = [];
  aliensGrid = [];
  scoreGui.saveScore();
  boardGui.update(isEnd);
}

startGame();
