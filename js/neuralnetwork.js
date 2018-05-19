"use strict";
//let game = new Game(100);
//game.run();
// create the network
//provide optional config object (or undefined). Defaults shown.
var config = {
  binaryThresh: 0.5,     // ¯\_(ツ)_/¯
  hiddenLayers: [3],     // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid' // Supported activation types ['sigmoid', 'relu', 'leaky-relu', 'tanh']
};
//create a simple feed forward neural network with backpropagation
let net = new brain.NeuralNetwork(config);
net.train([{input: [0, 0], output: [0]}]);
console.log(net.run([1, 0])[0]);
printNN(net);

//net.train([{input: [0, 0], output: [0]}, {input: [0, 1], output: [1]}, {input: [1, 0], output: [1]}, {input: [1, 1], output: [0]}]);
setNNData(net);
console.log(net.run([1, 0])[0]);

printNN(net);

function printNN(net){
  for (let layer = 1; layer <= net.outputLayer; layer++) {
    console.log(`\nLayer ${layer}`);
    for (let node = 0; node < net.sizes[layer]; node++) {
      console.log(`Node ${node}: \n\t weights: ${net.weights[layer][node]} \n\t biases: ${net.biases[layer][node]}`)
    }
  }
}

function setNNData(net){
  let mBiases = {
    1: [2.0001111030578613, 5.307599067687988, -1.0603669881820679],
    2: [-3.1898767948150635]
  };

  let myWeights = {
    1: [[-5.569168567657471,-5.6705427169799805],
      [-3.6463983058929443,-3.6617956161499023 ],
      [-1.9478660821914673,-2.086394786834717]],
    2: [[-7.441684246063232,7.229936599731445,-1.015587568283081 ]]
  };

  for (let layer = 1; layer <= net.outputLayer; layer++) {
    for (let node = 0; node < net.sizes[layer]; node++) {
      net.weights[layer][node] = myWeights[layer][node];
      net.biases[layer][node] = mBiases[layer][node];
    }
  }
}
