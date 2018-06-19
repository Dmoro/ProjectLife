function ControlPanel() {
  let self = this;
  self.playButton = document.getElementById("playButton");
  self.resetButton = document.getElementById("resetButton");
  self.populateButton = document.getElementById("populateButton");
  self.infoButton = document.getElementById("lookInfoButton");
  self.createBrainButton = document.getElementById("createBrain");
  self.createBrainPanel = document.getElementById("createBrainPanel");
  self.createBrainOKButton = document.getElementById("createBrainOK");
  self.createBrainCodeText = document.getElementById("brainCodeText");
  self.speedSlider = document.getElementById("speedSlider");
  self.titleText = document.getElementById("titleText");
  self.gameModeBtnIntel = document.getElementById("chooseIntelligentDesign");
  self.gameModeBtnLife = document.getElementById("chooseGameOfLife");
  self.drawModeText = document.getElementById("drawMode");

  this.playButton.onclick = function(){
    if(game.running) {
      game.running = false;
      self.playButton.value = "Play"
    } else {
      game.running = true;
      self.playButton.value = "Pause"
    }
  };

  this.resetButton.onclick = function(){
    game.running = false;
    game.currBoard.clearBoard();
    game.canvas.drawBoard(game.currBoard);
    game.running = true;
  };

  this.populateButton.onclick = function() {
    game.canvas.isPopulating = true;
    game.canvas.hideInfo();
    self.drawModeText.innerText = "Populating";
  };

  this.infoButton.onclick = function() {
    game.canvas.isPopulating = false;
    self.drawModeText.innerText = "Looking at Info";
  };

  this.createBrainButton.onclick = function() {
    if(self.createBrainPanel.style.display == "none" ||
       !self.createBrainPanel.style.display ){
      self.createBrainPanel.style.display = "block"
    } else {
      self.createBrainPanel.style.display = "none"
    }
  };

  this.createBrainOKButton.onclick = function() {
    BrainManager.setCode(self.createBrainCodeText.value)
    self.createBrainPanel.style.display = "none"
  };

  this.gameModeBtnIntel.onclick = function(){
    self.titleText.innerHTML = "Intelligent Design";
    game.currBoard.clearBoard();
    game.gameMode = "Intel";
    game.canvas.drawBoard(game.currBoard);
  };

  this.gameModeBtnLife.onclick = function(){
    self.titleText.innerHTML = "Game of Life";
    game.currBoard.clearBoard();
    game.gameMode = "Life";
    game.canvas.drawBoard(game.currBoard);
  };

  this.speedSlider.oninput = function(){
    let maxSpeed = 2000;
    game.speed = maxSpeed * Math.pow((1.0-self.speedSlider.value), 3);
    console.log("Speed: " + game.speed);
  };

  document.body.onkeyup = function(e){
    switch(e.key){
      case " ":
        game.running = !game.running;
        break;

      case "c":
        game.currBoard.clearBoard();
        game.canvas.drawBoard(game.currBoard);
        break;

      case "p":
        game.currBoard.randPopulate();
        game.canvas.drawBoard(game.currBoard);
        break;

      case "ArrowLeft":
        game.speed += (game.speed / 2);
        console.log("Speed: " + game.speed);
        break;

      case "ArrowRight":
        game.speed -= (game.speed / 2);
        console.log("Speed: " + game.speed);
        break;

      default:
        return;
    }
  };
}
