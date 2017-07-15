module.exports = {
// Utility Functions
  randomIntFromRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  randomColor: function (colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  },

  getDistance: function (x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }
};