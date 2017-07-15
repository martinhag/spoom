module.exports = Vertex;

function Vertex (x, y) {
  this.x = x;
  this.y = y;

  this.equal = function (other) {
    return this.x == other.x && this.y == other.y;
  };
}