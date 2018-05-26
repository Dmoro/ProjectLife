function ControlPanel() {
  let self = this;
  self.playButton = document.getElementById("playButton");
  self.resetButton = document.getElementById("resetButton");
  self.populateButton = document.getElementById("populateButton");
  self.speedSlider = document.getElementById("speedSlider");

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

  this.populateButton.onclick = function(){
    if(game.canvas.isPopulating) {
      game.canvas.isPopulating = false;
      self.populateButton.value = "Look at Info"
    } else {
      game.canvas.isPopulating = true;
      game.canvas.hideInfo();
      self.populateButton.value = "Populating"
    }
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
