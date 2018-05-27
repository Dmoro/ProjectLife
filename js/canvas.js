function Canvas (yMax) {
  let self = this;

  this.init = function() {
    self.CELL_COLOR = "#ffffff";
    self.BACK_COLOR = "#000000";
    self.BORDER_WIDTH = 1;
    self.isPopulating = true;
    self.isShowingInfoPanel = false;

    //get elements
    this.canvas = document.getElementById("boardCanvas");
    this.cvs = this.canvas.getContext("2d");

    //set correct sizes
    this.cvs.canvas.height = this.canvas.offsetHeight;
    this.cvs.canvas.width = this.canvas.offsetWidth;
    this.yMax = yMax;
    this.cellHeight =  this.cvs.canvas.height / this.yMax;
    this.cellWidth = this.cellHeight;
    this.xMax = Math.trunc(this.cvs.canvas.width / this.cellWidth);
  };
  self.init();


  this.drawCell = function(x, y, cell){
    //draw surrounding square
    this.cvs.fillStyle=self.BACK_COLOR;
    this.cvs.fillRect((x * this.cellWidth), (y * this.cellHeight ), this.cellWidth, this.cellHeight);

    let brightness = cell.energy / game.ENERGY_MAX;
    let klassColor = cell.klass / game.KLASS_MAX;
    let cellColor = rgbToHex((brightness*0.5 + klassColor*0.5) * 255,
      (brightness*0.5 + Math.abs(1-klassColor)*0.5) * 255,
      (brightness) * 255);
    //draw cell
    if(cell.isAlive === 1) {
      this.cvs.fillStyle = cellColor;
      this.cvs.fillRect((x * this.cellWidth) + self.BORDER_WIDTH, (y * this.cellHeight ) + self.BORDER_WIDTH,
        this.cellWidth - (2* self.BORDER_WIDTH), this.cellHeight - (2* self.BORDER_WIDTH));
    }
    //draw info panel
    if(self.isShowingInfoPanel && this.infoPanelxCell === x &&  this.infoPanelyCell === y) {
      self.updateInfo();
    }
  };

  this.refreshScreen = function(){
    //clean square
    this.cvs.fillStyle=self.BACK_COLOR;
    this.cvs.fillRect(0, 0, this.cvs.canvas.width, this.cvs.canvas.height);
  };

  this.drawBoard = function(board){
    this.refreshScreen();
    for(let i = 0; i < board.xMax; i++) {
      for(let j = 0; j < board.yMax; j++) {
        this.drawCell(i, j, board.getCell(i,j))
      }
    }
  };

  this.drawInfo = function(xCell, yCell, cell) {
    self.infoPanelxCell = xCell;
    self.infoPanelyCell = yCell;
    self.infoPanel = document.querySelector("#infoPanel");
    self.infoPanel.style.display = "block";
    self.infoPanel.style.transform = `translate3d(${xCell * this.cellWidth}px, ${yCell * this.cellHeight}px, 0)`;
    self.infoPanel.innerHTML = "<b style=\"font-size: 1.2em;\">Cell Info</b></br>" + cell;
    self.isShowingInfoPanel = true;
  };

  this.hideInfo = function() {
    let infoPanel = document.querySelector("#infoPanel");
    infoPanel.style.display = "none";
    self.isShowingInfoPanel = false;
  };

  this.updateInfo = function() {
    self.infoPanel.innerHTML = "<b style=\"font-size: 1.2em;\">Cell Info</b></br>" + game.currBoard.getCell(self.infoPanelxCell, self.infoPanelyCell);
  };

  this.getMousePos = function (evt) {
    let rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  this.resizeCanvas = function() {
    game.running = false;
    self.init();
    game.running = true;
    self.drawBoard(game.currBoard)
  };
  window.addEventListener('resize', this.resizeCanvas, false);
  window.addEventListener('orientationchange', this.resizeCanvas, false);


  //Handle mouse events CLICK
  this.canvas.addEventListener('mousemove', function(evt) {
    if(self.mouseDown){
      if(self.isPopulating) {
        let mousePos = self.getMousePos(evt);
        let xCell = Math.trunc(mousePos.x / self.cellWidth);
        let yCell = Math.trunc(mousePos.y / self.cellHeight);
        let cell = game.currBoard.getCell(xCell, yCell);
        cell.isAlive = 1;
        cell.addEnergy(100);
        cell.mybrain = BrainManager.createSmartNet();
        self.drawCell(xCell, yCell, cell);
      }
    }
  }, false);

  this.canvas.onmousedown = function(e) {
    self.mouseDown = true;
    if (!self.isPopulating) {
      if (self.isShowingInfoPanel) {
        self.hideInfo();
      } else {
        let mousePos = self.getMousePos(e);
        let xCell = Math.trunc(mousePos.x / self.cellWidth);
        let yCell = Math.trunc(mousePos.y / self.cellHeight);
        let cell = game.currBoard.getCell(xCell, yCell);
        self.drawInfo(xCell, yCell, cell);
      }
    }
  };

  this.canvas.onmouseup = function(e) {
    self.mouseDown = false;
  };
}
