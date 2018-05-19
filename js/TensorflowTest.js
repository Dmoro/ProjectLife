"use strict";
//<!-- Load TensorFlow.js -->
// <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.10.0"> </script>

//let game = new Game(100);
//game.run();
// Define a model for linear regression.
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1], name:'layer1'}));

// Prepare the model for training: Specify the loss and the optimizer.
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// Generate some synthetic data for training.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([10, 20, 30, 40], [4, 1]);

console.log("BEFORE")
let bad_weights = model.getLayer("layer1").getWeights();
console.log(bad_weights);
// Train the model using the data.
model.fit(xs, ys).then(() => {
  model.predict(tf.tensor2d([5], [1, 1])).print();
  console.log("AFTER")
  let trained_weights = model.getLayer("layer1").weights;
  console.log(trained_weights);
  console.log("put bad weights")
  model.getLayer("layer1").setWeights = bad_weights;
  model.predict(tf.tensor2d([5], [1, 1])).print();
});
