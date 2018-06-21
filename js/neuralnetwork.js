"use strict";
//FOR TESTING
// let gameNN = new GameNN(10, 4);
// let mynet = gameNN.createSmartNet();
// gameNN.printNN(mynet);
// console.log(gameNN.runNet(mynet, createArray(10,0)));

function GameNN(inputSize, outputSize){
  this.INPUT_SIZE = inputSize;
  this.OUTPUT_SIZE = outputSize;
  this.MAX_OUTPUT = 1000;

  this.CONFIG = {
    binaryThresh: 0.5,     // ¯\_(ツ)_/¯
    hiddenLayers: [3,3],     // array of ints for the sizes of the hidden layers in the network
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
      cleanResults[i] =  (netResults[i]-0.5) * this.MAX_OUTPUT;
    }
    return cleanResults;
  };

  this.alter = function (net) {
    if(net == null){
      console.log("creating dumb net");
      return null;
    }
    let newNet = this.createRandomNet();
    for (let layer = 1; layer <= net.outputLayer; layer++) {
      for (let node = 0; node < net.sizes[layer]; node++) {
        let nodeWeights = net.weights[layer][node];
        for(let w = 0; w < nodeWeights.length; w++){
          let weight = net.weights[layer][node][w];
          newNet.weights[layer][node][w] = weight + Math.random() - Math.random();
        }

        let bias = net.biases[layer][node];
        newNet.biases[layer][node] = bias + Math.random() - Math.random();
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
    console.log(net.train([{input:  [0,0,0,0,0,0,0,0,0,0], output: [0.0,0.0,0.0,0.0]},
               {input:  [200,0,0,0,0,0,0,0,0,0], output: [0.0,0.0,0.0,0.0]},
               {input:  [500,0,0,0,0,0,0,0,0,0], output: [0.0,0.0,0.0,0.0]},
               {input:  [800,0,0,0,0,0,0,0,0,0], output: [0.0,0.0,0.0,0.0]},
               {input:  [1000,0,0,0,0,0,0,0,0,0], output: [0.0,0.0,0.0,0.0]},
               {input:  [4000,0,0,0,0,0,0,0,0,0], output: [0.99,0.99,0.99,0.99]},
               {input:  [4200,0,0,0,0,0,0,0,0,0], output: [0.99,0.99,0.99,0.99]},
               {input:  [4400,0,0,0,0,0,0,0,0,0], output: [0.99,0.99,0.99,0.99]},
               {input:  [4600,0,0,0,0,0,0,0,0,0], output: [0.99,0.99,0.99,0.99]},
               {input:  [4800,0,0,0,0,0,0,0,0,0], output: [0.99,0.99,0.99,0.99]}]));
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
