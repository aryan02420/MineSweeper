let xsize, ysize, total, mines;                                                 // dimensions of board, no. of tiles, no. of mines
let gameboard;                                                                  // gameboard contsins info about tiles(mines, numbers of neighbors)
let gamestate;                                                                  // gamestate tracks intraction with tiles (0=no interaction, 1=clicked, 2=flagged)
let pg;                                                                         // stores hitboxes
let maskImg, tileImg, mineImg, flagImg, explImg, diffImg, wrngImg, num0Img;     // images
let num1Img, num2Img, num3Img, num4Img, num5Img, numImg, num7Img, num8Img;      // images
let numImgs;                                                                    // list for storing all numbered images
let openSfx, flagSfx, winSfx, explodeSfx                                        // sound effects
let size, _x, _y;                                                               // size of tiles. origin point of canvas
let margin = 1.03;                                                              // spacing between tiles
let root3 = Math.sqrt(3);                                                       // 1.7320...
let gameover;                                                                   // true if you win or tap mine`
let touchTime;                                                                  // measure duration of touch on mobile devices

function preload() {                                                            // preload images and sounds
  maskImg = loadImage('images/mask.png');
  tileImg = loadImage('images/tile.png');
  mineImg = loadImage('images/mine.png');
  flagImg = loadImage('images/flag.png');
  explImg = loadImage('images/expl.png');
  diffImg = loadImage('images/diff.png');
  wrngImg = loadImage('images/wrng.png');
  num0Img = loadImage('images/num0.png');
  num1Img = loadImage('images/num1.png');
  num2Img = loadImage('images/num2.png');
  num3Img = loadImage('images/num3.png');
  num4Img = loadImage('images/num4.png');
  num5Img = loadImage('images/num5.png');
  num6Img = loadImage('images/num6.png');
  num7Img = loadImage('images/num7.png');
  num8Img = loadImage('images/num8.png');
  soundFormats('wav');
  winSfx = loadSound('sfx/win');
  openSfx = loadSound('sfx/open');
  flagSfx = loadSound('sfx/flag');
  explodeSfx = loadSound('sfx/explode');
  numImgs = [num0Img, num1Img, num2Img, num3Img, num4Img, num5Img, num6Img, num7Img, num8Img];
}

function setup() {                                                              // ran once
  createCanvas(windowWidth, windowHeight);                                      // make a canvas
  reset();                                                                      // initialize game
}

function reset() {
  xsize = randInt(3, 6);                                                        // no of tiles in x direction
  ysize = randInt(3, 6);                                                        // no of tiles in y direction
  total = xsize * ysize;                                                        // total number of tiles
  mines = Math.floor(total / 7);                                                // total number of mines
  gameboard = new Array(total);
  gamestate = new Array(total);
  size = Math.min(window.innerWidth, window.innerHeight) / ((xsize + ysize) * margin / 2); // size of one tile
  _x = root3 * 0.82 * ((xsize / 2) - (ysize / 2)) * size / 3 * margin;          // shift in origin in x direction
  _y = ((xsize / 2) + (ysize / 2)) * size / 3 * margin;                         // shift in origin in y direction
  gameover = false;                                                             // game not over
  hitbox();                                                                     // calculate hitbox
  gameboard = gameboard.fill('0');                                              // all tiles are 0
  gamestate = gamestate.fill('0');                                              // all tiles can be interacted with
  generateMines();                                                              // put mines in gameboard
  putNumbers();                                                                 // put numbers in gameboard
  draw();                                                                       // draw the game
}

function windowResized() {                                                      // responsive design :)
  resizeCanvas(windowWidth, windowHeight);
  size = Math.min(window.innerWidth, window.innerHeight) / (xsize + ysize) * 2;
  _x = root3 * 0.82 * ((xsize / 2) - (ysize / 2)) * size / 3 * margin;
  _y = ((xsize / 2) + (ysize / 2)) * size / 3 * margin;
  hitbox();
  draw();
}

function touchStarted() {
  touchTime = parseInt(Date.now());                                             // on mobile devices, store time when touched
}

function touchEnded() {
  touchTime = parseInt(Date.now()) - touchTime;                                 // duration of touch
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)  {         // if clicked outside canvas
     return true;                                                               // do not preventDefault
  }
  if (gameover) {                                                               // if gameover
    reset();                                                                    // reset game
    return false;                                                               // preventDefault
  }
  let tileIndex = getTile();                                                    // which tile was tapped?
  if (tileIndex === false) return false;                                        // if no tile tapped, exit
  if (touchTime >= 0 && touchTime < 250) {                                      // on shortpress
    openTile(tileIndex);                                                        // open the tile`
    return false;
  }
  if (touchTime >= 250 && touchTime < 3000) {                                   // on longpress
    flagTile(tileIndex);                                                        // flag the tile
    return false;
  }
  return false;                                                                 // if nothing, preventDefault
}

function mouseReleased() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {          // if clicked outside canvas
     return true;                                                               // do not preventDefault
  }
  if (event.type === 'touchend') return false;                                  // if touch input receieved, ABORT!!
  if (gameover) {                                                               // if gameover
    reset();                                                                    // reset game
    return false;                                                               // preventDefault
  }
  let tileIndex = getTile();                                                    // which tile was tapped?
  if (tileIndex === false) return false;                                        // if no tile tapped, exit
  if (event.button === 2) {                                                     // if right click
    flagTile(tileIndex);                                                        // flag the tile
    return false;
  }
  if (event.button === 0) {                                                     // if left click
    openTile(tileIndex);                                                        // open tile
    return false;
  }
  return false;                                                                 // if nothing, preventDefault
}

function draw() {
  background(245);
  push();
  translate((width / 2 - size / 2) - _x, (height / 2 - size * 0.75 * 0.1) - _y);// set origin point on canvas
  for (let i = 0; i < (total); i++) {                                           // loop over all tiles
    isodraw(tileImg, i);                                                        // draw empty tile
    if (!gameover && gamestate[i] === '1') {                                    // if game is not over and tile is opened
      isodraw(numImgs[parseInt(gameboard[i])], i);                              // draw the numbered flag
    } else if (!gameover && gamestate[i] === '2') {                             // if game is not over and tile is flagged
      isodraw(flagImg, i);                                                      // draw flag
    } else if (gameover) {                                                      // if gameover
      if (gameboard[i] === 'm' && gamestate[i] === '2') isodraw(diffImg, i);    // if mine flagged
      else if (gameboard[i] === 'm' && gamestate[i] === '1') isodraw(explImg, i);// if mine detonated
      else if (gameboard[i] === 'm' && gamestate[i] === '0') isodraw(mineImg, i);// if mine unexplored
      else if (gameboard[i] !== 'm' && gamestate[i] === '2') isodraw(wrngImg, i);// if wrongly flagged
      else if (gamestate[i] === '1') isodraw(numImgs[parseInt(gameboard[i])], i);// draw remaining open tile
    }
  }
  pop();
  if (!gameover && checkWin()) {                                                // check if you win
    gameover = true;
    winSfx.play();
    draw();
  }
  noLoop();
}

function randInt(min, max) {                                                    // generate random integer between min and max both inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hitbox() {                                                             // stores hitboxes of tiles in a graphic object which is an off-screen canvas
  pg = createGraphics(width, height);                                           // create an off-screen canvas
  pg.background(0, 0, 255);                                                     // make it blue
  pg.translate((width / 2 - size / 2) - _x, (height / 2 - size * 0.75 * 0.1) - _y); // set the origin point so everything stays centered
  for (let i = 0; i < (total); i++) {                                           // for each tile
    let offx = i % xsize * size / 3 * margin;                                   // cartesian x offset
    let offy = Math.floor(i / xsize) * size / 3 * margin;                       // cartesian y offset
    pg.tint(i % xsize, Math.floor(i / xsize), 0);                               // color the tile
    pg.image(maskImg, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);// draw the tile
  }
}

function generateMines() {
  let m = mines;
  while (m > 0 && m <= total) {
    let tile = Math.floor(Math.random() * (total));                             // random position to put mine on
    if (gameboard[tile] != 'm') {                                               // if not already a mine
      gameboard[tile] = 'm';                                                    // make it a mine
      m--;
    }
  }
}

function calcMines(i) {
  let m = 0;                                                                    // start with zero surrounding mines
  leftExists = i % xsize != 0;                                                  // check which neighbors exist
  rightExists = i % xsize != xsize - 1;
  topExists = i >= xsize;
  bottomExists = i < total - xsize;
  if (leftExists) m += (gameboard[i - 1] === 'm');                              // if neighbor is a mine add one to m
  if (rightExists) m += (gameboard[i + 1] === 'm');
  if (topExists) m += (gameboard[i - xsize] === 'm');
  if (bottomExists) m += (gameboard[i + xsize] === 'm');
  if (leftExists && topExists) m += (gameboard[i - xsize - 1] === 'm');
  if (rightExists && topExists) m += (gameboard[i - xsize + 1] === 'm');
  if (leftExists && bottomExists) m += (gameboard[i + xsize - 1] === 'm');
  if (rightExists && bottomExists) m += (gameboard[i + xsize + 1] === 'm');
  return m;                                                                     // return number of surrounding mines
}

function putNumbers() {
  for (let i = 0; i < (total); i++) {
    let numofMines = calcMines(i)                                               // how many tiless surround current tile
    if (gameboard[i] !== 'm') {                                                 // if current tile is not a mine
      gameboard[i] = numofMines.toString();                                     // put the number
    }
  }
}

function isodraw(img, i) {
  let offx = i % xsize * size / 3 * margin;                                   // cartesian x offset
  let offy = Math.floor(i / xsize) * size / 3 * margin;                       // cartesian y offset`
  image(img, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);// empty tile
}

function printBoard(board) {                                                    // for debugging, outputs to console
  for (let i = 0; i < (ysize); i++) {
    console.log(board.slice(0 + i * xsize, (i + 1) * xsize).join(' '));
  }
}

function getTile() {                                                            // GENIUS part
  let c = pg.get(mouseX, mouseY);                                               // pick color from off screen canvas
  if (c[2] === 255) return false;                                               // if background color picked return false
  let i = c[0] + c[1] * xsize;                                                  // calculate index of tile
  return i;                                                                     // return index of tile
}

function openTile(i) {
  if (gamestate[i] === '0') {                                                   // if not opened before
    let leftExists = (i % xsize) > 0;                                           // check which neighbor exist
    let rightExists = (i % xsize) < xsize - 1;
    let topExists = i >= xsize;
    let bottomExists = i < total - xsize;
    gamestate[i] = '1';                                                         // open the tile
    if (gameboard[i] === '0') {                                                 // if current tile was empty
      setTimeout(() => {                                                        // RECURSION. YAY!
        if (leftExists && gamestate[i - 1] === '0') openTile(i - 1);            // open neighboring tiles if they exist and can be opened
        if (rightExists && gamestate[i + 1] === '0') openTile(i + 1);
        if (topExists && gamestate[i - xsize] === '0') openTile(i - xsize);
        if (bottomExists && gamestate[i + xsize] === '0') openTile(i + xsize);
        if (leftExists && topExists && gamestate[i - 1 - xsize] === '0') openTile(i - 1 - xsize);
        if (rightExists && topExists && gamestate[i + 1 - xsize] === '0') openTile(i + 1 - xsize);
        if (leftExists && bottomExists && gamestate[i - 1 + xsize] === '0') openTile(i - 1 + xsize);
        if (rightExists && bottomExists && gamestate[i + 1 + xsize] === '0') openTile(i + 1 + xsize);
      }, 100);
    } else if (gameboard[i] === 'm') {                                          // oops it was a mine
      gameover = true;                                                          // GAMEOVER
      explodeSfx.play();
    }
    openSfx.play();
    draw();
  }
}

function flagTile(i) {
  const s = gamestate[i];                                                       // get current state of tile
  if (s === '0') {                                                              // if untouched
    gamestate[i] = '2';                                                         // flag it
  } else if (s === '2') {                                                       // if flagged
    gamestate[i] = '0';                                                         // remove it
  }
  flagSfx.play();
  draw();
}

function checkWin() {
  for (let i = 0; i < (total); i++) {
    if (gamestate[i] === '2' && gameboard[i] !== 'm') return false;             // if wrongly flagged
    if (gameboard[i] === 'm' && gamestate[i] !== '2') return false;             // if mine not flagged
    if (gamestate[i] === '0') return false;                                     // if tile has not been touched`
  }
  return true;                                                                  // congratz
}
