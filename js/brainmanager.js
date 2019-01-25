"use strict";

function GeneralBrainManager(inputSize, outputSize){
  this.newBrainsType = "user";
  this.newCode = "return [0,0,0,0,0]";
  this.newName = 'Default'
  this.nn = new GameNN(inputSize, outputSize);
  this.newNet = this.nn.createSmartNet();
  self = this;

  this.setTypeNN = function() {
    self.newBrainsType = "nn";
    self.newCode = null;
    self.newNet = this.nn.createSmartNet();
  }

  this.setTypeUserCode = function() {
    self.newBrainsType = "user";
    self.newCode = "return [0,0,0,0,0]";
  }

  this.setCode = function(code){
    self.newCode = code;
  }

  this.create = function() {
    if (self.newBrainsType === "user") {
      return new Brain(self.newBrainsType, self.newCode, null);
    } else {
      return new Brain(self.newBrainsType, null, self.newNet);
    }
  }

  this.alter = function(originalBrain) {
    if (originalBrain.type === "user") {
      return originalBrain;
    } else {
      return new Brain(originalBrain.type, null, self.nn.alter(originalBrain));
    }
  }

  this.run = function(brain, input){
    if (brain.type === "user") {
      try{
        let func = new Function("me", "above", "right", "below", "left", brain.code);
        return func(input.me, input.above, input.right, input.below, input.left);
      } catch(err) {
        console.log("ERROR: " + err)
        return [0,0,0,0,0]
      }
    } else {
      return self.nn.run(brain.net, input.raw);
    }
  }

  this.clearStorage = function(){
    localStorage.removeItem("brainStorage")
  }

  this.load = function(name) {
    return this.loadAllBrains()[name.toLowerCase()]
  }

  this.loadAllBrains = function() {
    if(typeof(Storage) !== "undefined") {
      if (localStorage["brainStorage"]) {
        let brainStorage = JSON.parse(localStorage.getItem("brainStorage"))
        return brainStorage
      } else {
        return null
      }
    } else {
      console.log("Sorry, your browser does not support web storage...")
    }
  }

  this.save = function(name, brain) {
    if(typeof(Storage) !== "undefined") {
      let brainStorage = null;
      if(localStorage["brainStorage"]) {
        brainStorage = JSON.parse(localStorage.getItem("brainStorage"))
        console.log("loading up storage")
      } else {
        brainStorage = {default:new Brain('user', 'return[0,0,0,0,0]', null)};
        console.log("creating new storage")
      }

      let newBrain = new Brain(brain.type, brain.code, brain.net);
      brainStorage[name] = newBrain;
      localStorage.setItem("brainStorage", JSON.stringify(brainStorage));
    } else {
      console.log("Sorry, your browser does not support web storage...")
    }
  }

}

function Brain(type, code, net){
  this.type = type
  this.code = code
  this.net = net
}
