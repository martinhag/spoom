// Ball
function Ball(context, x, y, dx, dy, radius, mass, color) {
  this.c = context;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.mass = mass;
  this.color = color;

  this.update = function () {
    if ((this.x + this.dx + this.radius) > canvas.width || (this.x + this.dx - this.radius) < 0) {
      this.dx = -this.dx;
    }

    if ((this.y + this.dy + this.radius) > canvas.height || (this.y + this.dy - this.radius) < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  };

  this.draw = function () {
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.c.fillStyle = this.color;
    this.c.fill();
    this.c.closePath();
  };
}