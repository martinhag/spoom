var config = require('../util/config');
var util = require('../util/canvas-util');
var vectorUtil = require('../util/vector_util');
var Vertex = require('./Vertex');
var Sector = require('./Sector');
var Player = require('./Player');
var Enemy = require('./Enemy');

module.exports = Bullet;

// Bullet
function Bullet (x, y, dx, dy, sector, lifetime, fireSpeed, color, owner) {
  this.x = x;
  this.y = y;
  this.radius = 3;
  this.fireSpeed = fireSpeed;
  this.dx = dx * this.fireSpeed;
  this.dy = dy * this.fireSpeed;
  this.lifetime = lifetime;
  this.sector = sector;
  this.color = color;
  this.owner = owner;

  this.update = function () {
    //Check if bullet hits player og enemy
    // if(this.owner instanceof new Player) {
    // console.log(this.owner);
    this.hitCheckEnemy();
    // } else {
    //   this.hitCheckPlayer();
    // }
    // console.log(this.lifetime, this.owner);

    let vertices = this.sector.vertices;
    let neighbours = this.sector.neighbours;

    for(let i = 0; i < vertices.length; i++) {
      let a = vertices[i], b = vertices[i + 1];
      let portal = false;

      //Loop around for last corner
      if (i == vertices.length - 1) {
        b = vertices[0];
      }

      if (vectorUtil.intersectBox(this.x, this.y, (this.x ) + this.dx, (this.y ) + this.dy, a.x, a.y, b.x, b.y) &&
        vectorUtil.pointSide((this.x ) + this.dx, (this.y ) + this.dy, a.x, a.y, b.x, b.y) < 0) {

        for (let n of neighbours) {
          if (n.containsVertices(a, b)) {
            this.sector = n;
            portal = true;
          }
        }
        if (!portal) {
          this.lifetime = 0;
        }
      }
    }

    if(this.lifetime > 0) {
      this.x += this.dx;
      this.y += this.dy;
      this.lifetime -= 1;
    }
  };

  this.hitCheckEnemy = function () {
    for (let enemy of this.sector.enemies) {
      if (util.getDistance(enemy.x, enemy.y, this.x, this.y) < this.radius + enemy.radius && enemy.hp > 0) {
        enemy.hit();
        this.stopBullet();
      }
    }
  };

  this.hitCheckPlayer = function () {
    for (let player of this.sector.players) {
      if (util.getDistance(player.x, player.y, this.x, this.y) < this.radius + player.height) {
        player.hit();
        this.stopBullet();
      }
    }
  };

  this.draw = function () {
    config.c.beginPath();
    config.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    config.c.fillStyle = this.color;
    config.c.fill();
    config.c.lineWidth = 0.3;
    config.c.stroke();
    config.c.closePath();
    config.c.lineWidth = 1;
  };

  this.stopBullet = function () {
    this.lifetime = 0;
  };

  this.delete = function () {
    delete this;
  };
}