"use strict";
//let BrainManager = new GameNN(10, 4);
let BrainManager = new UserBrain(10,4);
let game = new Game(250);
game.start();

function Game (speed) {
  //Each cell is an array [isAlive 1 or 0, energy, klass, brain]
  //The class represents what kind of cell it is
  // A low class means the cell gains much energy every turn from sunlight
  // A high class means the cell gains no energy every turn from sunlight
  // A cell can only reproduce on lower classes. Reproduction means that the cell's class is slightly altered as well as the brain.
  // cells cannot move
  // every cell has a brain, with input of [top neighbor energy, top neighbor class, ... all neighbors] (size of 8)
  // output of brain is [energy to give to top neighbor, ... all neighbors] (size 4)
  // if energy is given to cell of lower class, that cell is killed and the original cell reproduces there
  // if energy given to cell of higher class, that energy is transferred
  // if energy is taken (negative energy) from lower class or higher class, the energy is simply taken.
  this.ENERGY_MAX = 100000;
  this.ENERGY_MIN = 0;
  this.KLASS_MAX = 100;
  this.KLASS_MIN = 0;
  this.speed = speed;
  this.running = true;
  this.yCellNum = 60;
  this.gameMode = 'Intel';

  this.start = function () {
    this.canvas = new Canvas(this.yCellNum);
    this.currBoard = new Board(this.canvas.xMax, this.canvas.yMax);
    this.controlPanel = new ControlPanel();

    //this.currBoard.randPopulate();
    this.canvas.drawBoard(this.currBoard);
    this.run();
  };

  this.run = async function () {
    for(let i = 0; i > -1 ; i++ ){
      if (this.running) {
        this.canvas.refreshScreen();
        if(this.gameMode === "Life") {
          this.currBoard = this.gameOfLifeRules(this.currBoard);
        } else {
          this.currBoard = this.newRules(this.currBoard);
        }
      }
      await sleep(this.speed);
    }
    // let self = this;
    // let oldSpeed = this.speed;
    // let timerId = setInterval(function () {
    //   if (self.running) {
    //     //console.log(turns);
    //     //this.currBoard = this.gameOfLifeRules(this.currBoard);
    //      self.canvas.refreshScreen();
    //      self.currBoard = self.newRules(self.currBoard);
    //
    //     if (Math.trunc(oldSpeed) !== Math.trunc(self.speed)) {
    //       clearInterval(timerId);
    //       self.run();
    //     }
    //   }
    //   console.log(`This many ms late: ${(Date.now() - oldTime) - self.speed}`);
    //   oldTime = Date.now();
    // }, this.speed);
  };

  this.newRules = function (board) {
    let nextBoard = new Board(this.canvas.xMax, this.canvas.yMax);
    nextBoard.deepCopy(board);
    let boardXmax = Math.min(board.xMax, nextBoard.xMax);
    let boardYmax = Math.min(board.yMax, nextBoard.yMax);
    for (let x = 0; x < boardXmax; x++) {
      for (let y = 0; y < boardYmax; y++) {
        let oldcell = board.getCell(x, y);
        if (oldcell.isAlive === 0) {
          continue;
        } //skip dead cells
        let cell = nextBoard.getCell(x, y);
        //console.log(`START TURN FOR [${x},${y}] ${cell}`);
        cell.age = cell.age + 1;
        //adjust cell body
        if (oldcell.energy <= this.ENERGY_MIN) {
          cell.kill();
          this.canvas.drawCell(x, y, cell);
          continue;
        }
        //add energy from sun
        cell.addEnergy((1 - (oldcell.klass / this.KLASS_MAX)) * 500);
        //take away energy from living
        cell.takeEnergy(50 + oldcell.klass);
        //brain in
        let pos = {above: [x, y + 1], right: [x + 1, y], bottom: [x, y - 1], left: [x - 1, y]};
        let brainInput =
          [oldcell.energy, oldcell.klass, //myself
            board.getCell(pos.above[0], pos.above[1]).energy, board.getCell(pos.above[0], pos.above[1]).klass, //above
            board.getCell(pos.right[0], pos.right[1]).energy, board.getCell(pos.right[0], pos.right[1]).klass, //right
            board.getCell(pos.bottom[0], pos.bottom[1]).energy, board.getCell(pos.bottom[0], pos.bottom[1]).klass, //bottom
            board.getCell(pos.left[0], pos.left[1]).energy, board.getCell(pos.left[0], pos.left[1]).klass,]; //left
        let brainOut = cell.runBrain(brainInput);
        //implement brain out
        pos = [[x, y + 1], [x + 1, y], [x, y - 1], [x - 1, y]];
        for (let i = 0; i < brainOut.length; i++) {
          let rcellOld = board.getCell(pos[i][0], pos[i][1]);

          if (brainOut[i] < 0) { //take energy
            let energyTaken = nextBoard.getCell(pos[i][0], pos[i][1]).takeEnergy(Math.abs(brainOut[i]));
            cell.addEnergy(Math.abs(energyTaken));

          } else if (brainOut[i] > 0) { //place energy
            if (rcellOld.isAlive === 0 || rcellOld.klass < oldcell.klass) { //check if can reproduce
              //console.log(`[${x},${y}] is reproducing. Giving ${brainOut[i]} energy to (${pos[i][0]},${pos[i][1]})`);
              let energyTaken = cell.takeEnergy(brainOut[i]);
              nextBoard.setCell(pos[i][0], pos[i][1],
                new Cell(1, energyTaken + board.getCell(pos[i][0], pos[i][1]).energy, addRandomInt(cell.klass, 5),
                BrainManager.alter(cell.mybrain)));
            } else { //if not reproduce, simply give energy
              if (cell.takeEnergy(brainOut[i]) >= brainOut[i]) {
                nextBoard.getCell(pos[i][0], pos[i][1]).addEnergy(brainOut[i]);
              }
            }
          }
          this.canvas.drawCell(pos[i][0], pos[i][1], nextBoard.getCell(pos[i][0], pos[i][1]));
        }
        this.canvas.drawCell(x, y, cell);
      }
    }
    return nextBoard;
  };

  this.gameOfLifeRules = function (board) {
    let nextBoard = new Board(this.canvas.xMax, this.canvas.yMax);
    nextBoard.deepCopy(board);
    let boardXmax = Math.min(board.xMax, nextBoard.xMax);
    let boardYmax = Math.min(board.yMax, nextBoard.yMax);
    for (let x = 0; x < boardXmax; x++) {
      for (let y = 0; y < boardYmax; y++) {
        let neighbors = board.countNeighbors(x, y);
        let cell = board.getCell(x, y);
        if (cell.isAlive === 1) { //live cell
          if (neighbors < 2 || neighbors > 3) { //kill lonely or overcrowded cells
            nextBoard.setCell(x, y, new Cell(0,1,0,null));
            this.canvas.drawCell(x, y, nextBoard.getCell(x, y));
          } else {
            nextBoard.setCell(x, y, new Cell(1,1,0,null));
            this.canvas.drawCell(x, y, nextBoard.getCell(x, y));
          }
        } else if (cell.isAlive === 0) { //dead cell
          if (neighbors === 3) { //create new cells
            nextBoard.setCell(x, y, new Cell(1,1,0,null));
            this.canvas.drawCell(x, y, nextBoard.getCell(x, y));
          }
        }
      }
    }
    return nextBoard;
  };
}
