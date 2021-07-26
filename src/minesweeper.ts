const TILE_EMPTY: 0 = 0
const TILE_MINE: -1 = -1
type tile_numbered = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
const STATE_UNMARKED: 0 = 0
const STATE_MARKED: 1 = 1
const STATE_FLAGGED: 2 = 2

type stateValue =
  | typeof STATE_UNMARKED
  | typeof STATE_MARKED
  | typeof STATE_FLAGGED
type boardValue =
  | typeof TILE_EMPTY
  | tile_numbered
  | typeof TILE_MINE

export default class Minesweeper {
  width: number
  height: number
  numTiles: number
  numMines: number
  board: boardValue[]
  state: stateValue[]
  isGameOver: boolean

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.numTiles = width * height
    this.numMines = 3
    this.board = new Array(this.numTiles)
    this.board.fill(0)
    this.state = new Array(this.numTiles)
    this.state.fill(0)
    this.isGameOver = false
  }

  generateMines() {
    let m = this.numMines
    while (m > 0 && m <= this.numTiles) {
      let tile = Math.floor(Math.random() * this.numTiles)
      if (this.board[tile] != TILE_MINE) {
        this.board[tile] = TILE_MINE
        m--
      }
    }
  }

  calcNeighboringMines(i:number): typeof TILE_EMPTY | tile_numbered {
    let m: typeof TILE_EMPTY | tile_numbered = 0
    let leftTileExists = i % this.width != 0
    let rightTileExists = i % this.width != this.width - 1
    let topTileExists = i >= this.width
    let bottomTileExists = i < this.numTiles - this.width
    if (leftTileExists) m += Number(this.board[i - 1] === TILE_MINE)
    if (rightTileExists) m += Number(this.board[i + 1] === TILE_MINE)
    if (topTileExists) m += Number(this.board[i - this.width] === TILE_MINE)
    if (bottomTileExists) m += Number(this.board[i + this.width] === TILE_MINE)
    if (leftTileExists && topTileExists) m += Number(this.board[i - this.width - 1] === TILE_MINE)
    if (rightTileExists && topTileExists) m += Number(this.board[i - this.width + 1] === TILE_MINE)
    if (leftTileExists && bottomTileExists) m += Number(this.board[i + this.width - 1] === TILE_MINE)
    if (rightTileExists && bottomTileExists) m += Number(this.board[i + this.width + 1] === TILE_MINE)
    return m as typeof TILE_EMPTY | tile_numbered
  }

  putNumbers() {
    for (let i = 0; i < (this.numTiles); i++) {
      let numOfNeighboringMines = this.calcNeighboringMines(i)
      if (this.board[i] !== TILE_EMPTY) {
        this.board[i] = numOfNeighboringMines
      }
    }
  }

  openTile(i:number) {
    if (this.state[i] === STATE_UNMARKED) {
      let leftExists = (i % this.width) > 0
      let rightExists = (i % this.width) < this.width - 1
      let topExists = i >= this.width
      let bottomExists = i < this.numTiles - this.width
      this.state[i] = STATE_MARKED
      if (this.board[i] === TILE_EMPTY) {
        setTimeout(() => {
          if (leftExists && this.state[i - 1] === STATE_UNMARKED) this.openTile(i - 1)
          if (rightExists && this.state[i + 1] === STATE_UNMARKED) this.openTile(i + 1)
          if (topExists && this.state[i - this.width] === STATE_UNMARKED) this.openTile(i - this.width)
          if (bottomExists && this.state[i + this.width] === STATE_UNMARKED) this.openTile(i + this.width)
          if (leftExists && topExists && this.state[i - 1 - this.width] === STATE_UNMARKED) this.openTile(i - 1 - this.width)
          if (rightExists && topExists && this.state[i + 1 - this.width] === STATE_UNMARKED) this.openTile(i + 1 - this.width)
          if (leftExists && bottomExists && this.state[i - 1 + this.width] === STATE_UNMARKED) this.openTile(i - 1 + this.width)
          if (rightExists && bottomExists && this.state[i + 1 + this.width] === STATE_UNMARKED) this.openTile(i + 1 + this.width)
        }, 100)
      } else if (this.board[i] === TILE_MINE) {
        this.isGameOver = true
      }
    }
  }

  flagTile(i:number) {
    if (this.state[i] === STATE_UNMARKED) {
      this.state[i] = STATE_FLAGGED
    } else if (this.state[i] === STATE_FLAGGED) {
      this.state[i] = STATE_UNMARKED
    }
  }

  checkWin() {
    for (let i = 0; i < (this.numTiles); i++) {
      if (this.state[i] === STATE_FLAGGED && this.board[i] !== TILE_MINE) return false
      if (this.board[i] === TILE_MINE && this.state[i] !== STATE_FLAGGED) return false
      if (this.state[i] === STATE_UNMARKED) return false
    }
    return true
  }
}


