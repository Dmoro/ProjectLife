function ControlPanel() {
  let self = this;
  self.playButton = document.getElementById("playButton");
  self.resetButton = document.getElementById("resetButton");
  self.populateButton = document.getElementById("populateButton");
  self.infoButton = document.getElementById("lookInfoButton");
  self.createBrainButton = document.getElementById("createBrain");
  self.createBrainPanel = document.getElementById("createBrainPanel");
  self.createBrainOKButton = document.getElementById("createBrainOK");
  self.createBrainTypeButton = document.getElementById("brainType");
  self.createBrainLoadButton = document.getElementById("loadBrain");
  self.createBrainSaveButton = document.getElementById("saveBrain");
  self.createBrainName = document.getElementById("brainName");
  self.createBrainClearStorage = document.getElementById("clearStorage");
  self.createBrainCodeText = document.getElementById("brainCodeText");
  self.createBrainLoadBrain = document.getElementById("brainLoader");
  self.createBrainLoadBrainList = document.getElementById("brainLoaderList");
  self.speedSlider = document.getElementById("speedSlider");
  self.titleText = document.getElementById("titleText");
  self.gameModeBtnIntel = document.getElementById("chooseIntelligentDesign");
  self.gameModeBtnLife = document.getElementById("chooseGameOfLife");
  self.drawModeText = document.getElementById("drawMode");
  self.nnTextCode = "Neural Network model:\n  " +
                    "- Two hidden layers of three nodes each\n  " +
                    "- Sigmoid activation function\n  - Used Brain.js (github.com/BrainJS/brain.js)"

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
      if(BrainManager.newBrainsType === 'user') {
        self.createBrainCodeText.value = BrainManager.newCode;
        self.createBrainName.value = BrainManager.newName;
        self.createBrainCodeText.readOnly = false;
      } else {
        self.createBrainCodeText.value = self.nnTextCode;
        self.createBrainCodeText.readOnly = true;
      }
    } else {
      self.createBrainPanel.style.display = "none"
    }
  };

  this.createBrainOKButton.onclick = function() {
    if(BrainManager.newBrainsType === 'user') {
      BrainManager.setCode(self.createBrainCodeText.value);
      BrainManager.newName = self.createBrainName.value;
    }
    self.createBrainPanel.style.display = "none"
  };

  this.createBrainTypeButton.onclick = function() {
    if(BrainManager.newBrainsType === 'user') {
      self.createBrainTypeButton.value = "Create User Brain"
      BrainManager.newBrainsType = 'nn'
      self.createBrainCodeText.value = self.nnTextCode;
      self.createBrainCodeText.readOnly = true;
      self.createBrainLoadButton.style.display = "none"
      self.createBrainSaveButton.style.display = "none"
      self.createBrainClearStorage.style.display = "none"
    } else {
      self.createBrainTypeButton.value = "Create NN Brain"
      BrainManager.newBrainsType = 'user';
      self.createBrainCodeText.value = BrainManager.newCode;
      self.createBrainCodeText.readOnly = false;
      self.createBrainLoadButton.style.display = "inline"
      self.createBrainSaveButton.style.display = "inline"
      self.createBrainClearStorage.style.display = "inline"
    }
  };

  this.createBrainSaveButton.onclick = function() {
    if(BrainManager.newBrainsType === 'user') {
      let newBrain = new Brain('user', self.createBrainCodeText.value, null);
      BrainManager.save(self.createBrainName.value.toLowerCase(), newBrain);
    } else {
      console.log('Cannot save NNs');
    }
  }

  this.loadSpecificBrain = function( e ){
      name = e.toElement.innerText
      console.log("loading " + name)
      if(BrainManager.newBrainsType === 'user') {
        let loadBrain = BrainManager.load(name);
        self.createBrainName.value = name;
        self.createBrainCodeText.value = loadBrain.code;
      } else {
        console.log('Cannot load NNs');
      }

      self.createBrainLoadBrain.style.display = "none";
  }

  this.createBrainClearStorage.onclick = function(){
    BrainManager.clearStorage();
    self.refreshLoadList();
  }

  this.refreshLoadList = function() {
    //clear list
    let myNode = self.createBrainLoadBrainList
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    //Add all brains to list
    let allBrains = BrainManager.loadAllBrains()
    for(let i in allBrains){
      let entry = document.createElement('button');
      entry.addEventListener('click', self.loadSpecificBrain);
      entry.className = "brainLoaderListItem mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect";
      let text = document.createTextNode(i)
      entry.appendChild(text);
      self.createBrainLoadBrainList.appendChild(entry);
    }
  }

  this.createBrainLoadButton.onclick = function() {
    self.refreshLoadList();

    if(self.createBrainLoadBrain.style.display === 'none'){
      self.createBrainLoadBrain.style.display = "block";
    } else {
      self.createBrainLoadBrain.style.display = "none";
    }

  }

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

  // document.body.onkeyup = function(e){
  //   switch(e.key){
  //     case " ":
  //       game.running = !game.running;
  //       break;
  //
  //     case "c":
  //       game.currBoard.clearBoard();
  //       game.canvas.drawBoard(game.currBoard);
  //       break;
  //
  //     case "p":
  //       game.currBoard.randPopulate();
  //       game.canvas.drawBoard(game.currBoard);
  //       break;
  //
  //     case "ArrowLeft":
  //       game.speed += (game.speed / 2);
  //       console.log("Speed: " + game.speed);
  //       break;
  //
  //     case "ArrowRight":
  //       game.speed -= (game.speed / 2);
  //       console.log("Speed: " + game.speed);
  //       break;
  //
  //     default:
  //       return;
  //   }
  // };
}
