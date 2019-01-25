"use strict";
//FOR TESTING
// let gameNN = new GameNN(10, 4);
// let mynet = gameNN.createSmartNet();
// gameNN.printNN(mynet);
// console.log(gameNN.runNet(mynet, createArray(10,0)));

function GameNN(inputSize, outputSize){
  this.INPUT_SIZE = inputSize;
  this.OUTPUT_SIZE = outputSize;
  this.MAX_OUTPUT = 500;

  this.CONFIG = {
    binaryThresh: 0.5,     // ¯\_(ツ)_/¯
    hiddenLayers: [5,5],     // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // Supported activation types ['sigmoid', 'relu', 'leaky-relu', 'tanh']
    iterations: 0,
    timeout: 1,
  };

  this.run = function(net, input) {
    //check input
    if(input.length !== this.INPUT_SIZE) {
      console.log("ERROR: incorrect input size to NN")
      console.log(input)
      return null;
    }

    //run the NN
    let netResults = net.run(input);
    let cleanResults = [];
    for(let i = 0; i < netResults.length; i++){
      if(i < 4){
        cleanResults[i] =  (netResults[i]-0.2) * this.MAX_OUTPUT;
      } else {
        cleanResults[i] =  netResults[i] * 100; // klass output
      }
    }
    return cleanResults;
  };

  this.alter = function (net) {
    let nudge = (Math.random() - 0.5) * 0.1

    if(net == null){
      console.log("creating dumb net");
      return null;
    }
    let newNet = this.createRandomNet();
    net = net.net
    for (let layer = 1; layer <= net.outputLayer; layer++) {
      for (let node = 0; node < net.sizes[layer]; node++) {
        let nodeWeights = net.weights[layer][node];
        for(let w = 0; w < nodeWeights.length; w++){
          let weight = net.weights[layer][node][w];
          newNet.weights[layer][node][w] = weight + nudge;
        }

        let bias = net.biases[layer][node];
        newNet.biases[layer][node] = bias + nudge;
      }
    }
    return newNet;
  };

  this.createRandomNet = function(){
    let net = new brain.NeuralNetwork(this.CONFIG);
    net.train([{input:  createArray(this.INPUT_SIZE, 1),
                output:  createArray(this.OUTPUT_SIZE, 1)}]);
    return net;
  };

  this.createSmartNet = function(){
    let net = new brain.NeuralNetwork({
      binaryThresh: 0.5,
      hiddenLayers: [3,3],
      activation: 'sigmoid',
      iterations: 100,
      timeout: 100000,
    });
    console.log(net.train([{input:  [0,0,0,0,0,0,0,0,0,0], output: [0.0,0.0,0.0,0.0,0.0]},
               {input:  [200,0,0,0,0,0,0,0,0,0], output: [0.7,0.0,0.0,0.0,0.1]},
               {input:  [500,0,0,0,0,0,0,0,0,0], output: [0.7,0.0,0.0,0.0,0.0]},
               {input:  [800,0,0,0,0,0,0,0,0,0], output: [0.7,0.0,0.0,0.0,0.0]},
               {input:  [1000,0,0,0,0,0,0,0,0,0], output: [0.7,0.0,0.0,0.0,0.1]},
               {input:  [10000,0,0,0,0,0,0,0,0,0], output: [0.7,0.6,0.6,0.6,0.0]},
               {input:  [42000,0,0,0,0,0,0,0,0,0], output: [0.6,0.6,0.6,0.6,0.0]},
               {input:  [44000,0,0,0,0,0,0,0,0,0], output: [0.6,0.6,0.6,0.6,0.1]},
               {input:  [46000,0,0,0,0,0,0,0,0,0], output: [0.6,0.6,0.6,0.6,0.0]},
               {input:  [48000,0,0,0,0,0,0,0,0,0], output: [0.6,0.6,0.6,0.6,0.0]}]));
    return net;
  };

  this.printNN = function(net){
    for (let layer = 1; layer <= net.outputLayer; layer++) {
      console.log(`\nLayer ${layer}`);
      for (let node = 0; node < net.sizes[layer]; node++) {
        console.log(`Node ${node}: \n\t weights: ${net.weights[layer][node]} \n\t biases: ${net.biases[layer][node]}`)
      }
    }
  };
}
