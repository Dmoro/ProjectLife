function Cell(isAlive, energy, klass, mybrain){
  this.isAlive = isAlive;
  this.age = isAlive;

  if(energy > game.ENERGY_MAX) { this.energy = game.ENERGY_MAX; }
  else if (energy < game.ENERGY_MIN) { this.energy = game.ENERGY_MIN; }
  else { this.energy = energy;  }

  if(klass > game.KLASS_MAX) { this.klass = game.KLASS_MAX; }
  else if (klass < game.KLASS_MIN) { this.klass = game.KLASS_MIN; }
  else { this.klass = klass;  }

  this.mybrain = mybrain;
  this.lastBrainOut = [0,0,0,0];

  this.clear = function(){
    this.isAlive = 0;
    this.energy = 0;
    this.klass = 0;
    this.mybrain = null;
  };

  this.kill = function(){
    this.isAlive = 0;
  };

  this.checkIfAlive = function(){
    if(this.energy <= 0) {
      this.kill();
    }
  };

  this.runBrain = function(input) {
    if(!mybrain){
      return [0,0,0,0]
    } else {
      // format input
      input = {
        me: {energy: input[0], klass: input[1]},
        above: {energy: input[2], klass: input[3]},
        right: {energy: input[4], klass: input[5]},
        below: {energy: input[6], klass: input[7]},
        left: {energy: input[8], klass: input[9]},
        raw: input
      }
      this.lastBrainOut = BrainManager.run(this.mybrain, input);
      return this.lastBrainOut;
    }
  };

  this.takeEnergy = function(amount) {
    if(this.energy - amount >= game.ENERGY_MIN){
      this.energy = this.energy - amount;
      this.checkIfAlive();
      return amount;
    } else {
      let amountDif = this.energy - game.ENERGY_MIN;
      this.energy = game.ENERGY_MIN;
      this.checkIfAlive();
      return amountDif;
    }
  };

  this.addEnergy = function(amount) {
    //console.log(`Adding ${amount} energy to ${this.energy}`);
    if(this.energy + amount <= game.ENERGY_MAX){
      this.energy = this.energy + amount;
    } else {
      this.energy = game.ENERGY_MAX;
    }
    this.checkIfAlive();
  };

  this.deepCopy = function(){
    let cell = new Cell(this.isAlive, this.energy, this.klass, this.mybrain);
    cell.age = this.age;
    return cell;
  };

  this.toString = function(){
    return `<b>Alive:</b> ${this.isAlive} <br /> <b>Age:</b> ${this.age} <br /> <b>Energy:</b> ${Math.trunc(this.energy)} <br /> <b>Klass:</b> ${this.klass}
            <br /> <b>Brain:</b> ${Math.trunc(this.lastBrainOut[0])} ${Math.trunc(this.lastBrainOut[1])}
            ${Math.trunc(this.lastBrainOut[2])} ${Math.trunc(this.lastBrainOut[3])}`;
  }

}
