function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //both inclusive
}
let xsize = randInt(3, 6);
let ysize = randInt(3, 6);
let total = xsize * ysize;
let mines = Math.floor(total / 7);
let gameboard = new Array(total);
let gamestate = new Array(total);
let pg, maskImg, tileImg, mineImg, flagImg, explImg, diffImg, wrngImg;
let num0Img, num1Img, num2Img, num3Img, num4Img, num5Img, numImg, num7Img, num8Img;
let size = Math.min(window.innerWidth, window.innerHeight) / (xsize + ysize) * 2;
let margin = 1.03;
let root3 = Math.sqrt(3);
let _x = root3 * 0.82 * ((xsize / 2) - (ysize / 2)) * size / 3 * margin;
let _y = ((xsize / 2) + (ysize / 2)) * size / 3 * margin;
let gameover = false;

function preload() {
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
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  hitbox();
  gameboard = gameboard.fill('0');
  gamestate = gamestate.fill('0');
  generateMines();
  putNumbers();
}

function reset() {
  xsize = randInt(3, 6);
  ysize = randInt(3, 6);
  total = xsize * ysize;
  mines = Math.floor(total / 7);
  gameboard = new Array(total);
  gamestate = new Array(total);
  size = Math.min(window.innerWidth, window.innerHeight) / (xsize + ysize) * 2;
  margin = 1.03;
  root3 = Math.sqrt(3);
  _x = root3 * 0.82 * ((xsize / 2) - (ysize / 2)) * size / 3 * margin;
  _y = ((xsize / 2) + (ysize / 2)) * size / 3 * margin;
  gameover = false;
  hitbox();
  gameboard = gameboard.fill('0');
  gamestate = gamestate.fill('0');
  generateMines();
  putNumbers();
  draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  size = Math.min(window.innerWidth, window.innerHeight) / (xsize + ysize) * 2;
  _x = root3 * 0.82 * ((xsize / 2) - (ysize / 2)) * size / 3 * margin;
  _y = ((xsize / 2) + (ysize / 2)) * size / 3 * margin;
}

function mouseReleased() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return true;
  if (gameover) {
    reset();
    return false;
  }
  let tileIndex = getTile();
  if (tileIndex === false) return false;
  if (event.button === 2) {
    flagTile(tileIndex);
    return false;
  }
  if (event.button === 0) {
    openTile(tileIndex);
    return false;
  }
  return false;
}

function draw() {
  background(245);
  push();
  translate((width / 2 - size / 2) - _x, (height / 2 - size * 0.75 * 0.1) - _y);
  for (let i = 0; i < (total); i++) {
    let offx = i % xsize * size / 3 * margin;
    let offy = Math.floor(i / xsize) * size / 3 * margin;
    image(tileImg, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
    if (!gameover && gamestate[i] === '1') {
      let Img;
      if (gameboard[i] === '0') Img = num0Img;
      else if (gameboard[i] === '1') Img = num1Img;
      else if (gameboard[i] === '2') Img = num2Img;
      else if (gameboard[i] === '3') Img = num3Img;
      else if (gameboard[i] === '4') Img = num4Img;
      else if (gameboard[i] === '5') Img = num5Img;
      else if (gameboard[i] === '6') Img = num6Img;
      else if (gameboard[i] === '7') Img = num7Img;
      else if (gameboard[i] === '8') Img = num8Img;
      image(Img, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
    } else if (!gameover && gamestate[i] === '2') {
      image(flagImg, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
    } else if (gameover) {
      if (gameboard[i] === 'm' && gamestate[i] === '2') image(diffImg, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
      else if (gameboard[i] === 'm' && gamestate[i] === '1') image(explImg, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
      else if (gameboard[i] === 'm' && gamestate[i] === '0') image(mineImg, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
      else if (gameboard[i] !== 'm' && gamestate[i] === '2') image(wrngImg, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
      else if (gamestate[i] === '1') {
        let Img;
        if (gameboard[i] === '0') Img = num0Img;
        else if (gameboard[i] === '1') Img = num1Img;
        else if (gameboard[i] === '2') Img = num2Img;
        else if (gameboard[i] === '3') Img = num3Img;
        else if (gameboard[i] === '4') Img = num4Img;
        else if (gameboard[i] === '5') Img = num5Img;
        else if (gameboard[i] === '6') Img = num6Img;
        else if (gameboard[i] === '7') Img = num7Img;
        else if (gameboard[i] === '8') Img = num8Img;
        image(Img, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
      }
    }
  }
  pop();
  if (!gameover && checkWin()) {
    gameover = true;
    draw();
  }
  noLoop();
}

function hitbox() {
  pg = createGraphics(width, height);
  pg.background(0, 0, 255);
  pg.translate((width / 2 - size / 2) - _x, (height / 2 - size * 0.75 * 0.1) - _y);
  for (let i = 0; i < (total); i++) {
    let offx = i % xsize * size / 3 * margin;
    let offy = Math.floor(i / xsize) * size / 3 * margin;
    pg.tint(i % xsize, Math.floor(i / xsize), 0);
    pg.image(maskImg, root3 * 0.82 * (offx - offy), 1 * (offx + offy), size, size * 0.75);
  }
}

function generateMines() {
  let m = mines;
  while (m > 0 && m <= total) {
    let tile = Math.floor(Math.random() * (total));
    if (gameboard[tile] != 'm') {
      gameboard[tile] = 'm';
      m--;
    }
  }
}

function calcMines(i) {
  let m = 0;
  leftExists = i % xsize != 0;
  rightExists = i % xsize != xsize - 1;
  topExists = i >= xsize;
  bottomExists = i < total - xsize;
  if (leftExists) m += (gameboard[i - 1] === 'm');
  if (rightExists) m += (gameboard[i + 1] === 'm');
  if (topExists) m += (gameboard[i - xsize] === 'm');
  if (bottomExists) m += (gameboard[i + xsize] === 'm');
  if (leftExists && topExists) m += (gameboard[i - xsize - 1] === 'm');
  if (rightExists && topExists) m += (gameboard[i - xsize + 1] === 'm');
  if (leftExists && bottomExists) m += (gameboard[i + xsize - 1] === 'm');
  if (rightExists && bottomExists) m += (gameboard[i + xsize + 1] === 'm');
  return m;
}

function putNumbers() {
  for (let i = 0; i < (total); i++) {
    let numofMines = calcMines(i)
    gameboard[i] = numofMines === 0 || gameboard[i] === 'm' ? gameboard[i] : calcMines(i).toString();
  }
}

function isodraw(img, x, y) {}

function printBoard(board) {
  for (let i = 0; i < (ysize); i++) {
    console.log(board.slice(0 + i * xsize, (i + 1) * xsize).join(' '));
  }
}

function getTile() {
  let c = pg.get(mouseX, mouseY);
  let i = c[0] + c[1] * xsize;
  if (c[2] === 255) return false;
  return i;
}

function openTile(i) {
  if (gamestate[i] === '0') {
    let leftExists = (i % xsize) > 0;
    let rightExists = (i % xsize) < xsize - 1;
    let topExists = i >= xsize;
    let bottomExists = i < total - xsize;
    gamestate[i] = '1';
    if (gameboard[i] === '0') {
      setTimeout(() => {
        if (leftExists && gamestate[i - 1] === '0') openTile(i - 1);
        if (rightExists && gamestate[i + 1] === '0') openTile(i + 1);
        if (topExists && gamestate[i - xsize] === '0') openTile(i - xsize);
        if (bottomExists && gamestate[i + xsize] === '0') openTile(i + xsize);
        if (leftExists && topExists && gamestate[i - 1 - xsize] === '0') openTile(i - 1 - xsize);
        if (rightExists && topExists && gamestate[i + 1 - xsize] === '0') openTile(i + 1 - xsize);
        if (leftExists && bottomExists && gamestate[i - 1 + xsize] === '0') openTile(i - 1 + xsize);
        if (rightExists && bottomExists && gamestate[i + 1 + xsize] === '0') openTile(i + 1 + xsize);
      }, 100);
    } else if (gameboard[i] === 'm') {
      gameover = true;
    }
  }
  draw();
}

function flagTile(i) {
  const s = gamestate[i];
  if (s === '0') {
    gamestate[i] = '2';
  } else if (s === '2') {
    gamestate[i] = '0';
  }
  draw();
}

function checkWin() {
  for (let i = 0; i < (total); i++) {
    if (gamestate[i] === '2' && gameboard[i] !== 'm') return false;
    if (gameboard[i] === 'm' && gamestate[i] !== '2') return false;
    if (gamestate[i] === '0') return false;
  }
  return true;
}
