"use strict";

function GeneralBrainManager(inputSize, outputSize){
  this.newBrainsType = "user";
  this.newCode = "return [0,0,0,0]";
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
    self.newCode = "return [0,0,0,0]";
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
        return [0,0,0,0]
      }
    } else {
      return self.nn.run(brain.net, input.raw);
    }
  }
}

function Brain(type, code, net){
  this.type = type
  this.code = code
  this.net = net
}
