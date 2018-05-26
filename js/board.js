function Board (xMax, yMax) {
  this.setupBoard = function() {
    for (let i = 0; i < this.xMax; i++) {
      let cols = [];
      for (let j = 0; j < this.yMax; ++j) {
        cols[j] = new Cell(0,0,0,null);
      }
      this.board[i] = cols;
    }
  };

  this.deepCopy = function(board){
    for (let x = 0; x < this.xMax; x++) {
      for (let y = 0; y < this.yMax; y++) {
        if(board.getCell(x,y).isAlive === 1)
          this.setCell(x,y, board.getCell(x,y).deepCopy());
      }
    }
  };

  this.clearBoard = function() {
    for (let x = 0; x < this.xMax; x++) {
      for (let y = 0; y < this.yMax; y++) {
        this.getCell(x,y).clear();
      }
    }
  };

  this.getCell = function (x, y) {
    if(x > this.xMax - 1 || x < 0) return new Cell(0,0,0,null);
    if(y > this.yMax - 1 || y < 0) return new Cell(0,0,0,null);
    //console.log(`Getting [${x}, ${y}] and the maxes are [${this.xMax}, ${this.yMax}] `)
    return this.board[x][y];
  };

  this.setCell = function (x, y, cell) {
    if(x > this.xMax - 1 || x < 0) return;
    if(y > this.yMax - 1 || y < 0) return;
    this.board[x][y] = cell;
  };

  this.countNeighbors = function(x, y){
    let totalCount = 0;
    totalCount += x>0 && y>0 ?  this.getCell(x-1, y-1).isAlive : 0; //topleft
    totalCount += y>0 ?  this.getCell(x, y-1).isAlive : 0; //top
    totalCount += x<(this.xMax-1) && y>0 ?  this.getCell(x+1, y-1).isAlive : 0; //topRight
    totalCount += x>0 ?  this.getCell(x-1, y).isAlive : 0; //left
    totalCount += x<(this.xMax-1) ?  this.getCell(x+1, y).isAlive : 0; //right
    totalCount += x>0 && y<(this.yMax-1) ? this.getCell(x-1,y+1).isAlive : 0; //bottomRight
    totalCount += y<(this.yMax-1) ?  this.getCell(x,y+1).isAlive : 0; //bottom
    totalCount += x<(this.xMax-1) && y<(this.yMax-1) ?  this.getCell(x+1,y+1).isAlive : 0; //bottomRight
    return totalCount;
  };

  this.randPopulate = function() {
    //set random start cells
    let startCells = (this.xMax*this.yMax)/10;
    for (let i = 0; i < startCells; i++) {
      this.getCell(getRandomInt(this.xMax-1), getRandomInt(this.yMax-1)).isAlive = 1;
    }
  };

  this.xMax = xMax;
  this.yMax = yMax;
  this.board = [];
  this.setupBoard();
}
