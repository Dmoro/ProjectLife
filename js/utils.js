function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntRange(min, max) {
  return Math.floor(Math.random() * Math.floor(max - min)) + min;
}

function addRandomInt(origin, rand) {
  return origin + getRandomIntRange(-rand, rand)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//author: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

//author: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
  return "#" + componentToHex(Math.trunc(r)) + componentToHex(Math.trunc(g)) + componentToHex(Math.trunc(b));
}
