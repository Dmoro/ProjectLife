"use strict";

function UserBrain(inputSize, outputSize){
  this.type = "user"
  this.new_code = "if (me.energy > 500) { return [20, 20, 20, 20]; } else { return [-100,0,0,0]; }"

  this.setCode = function(code){
    this.new_code = code;
  }

  this.create = function() {
    return this.new_code;
  }

  this.alter = function(originalBrain) {
    return originalBrain;
  }

  this.run = function(brain, input){
    let func = new Function("me", "above", "right", "below", "left", brain);
    return func(input.me, input.above, input.right, input.below, input.left);
  }
}
