var config = require('../util/config');
var vectorUtil = require('../util/vector_util');
var util = require('../util/canvas-util');
var Vertex = require('./Vertex');
var Enemy = require('./Enemy');
var Player = require('./Player');
var RapidFire = require('./effects/RapidFire');

module.exports = Sector;

// Sector
function Sector (id, vertices, color) {
  this.id = id;
  this.vCount = vertices.length;
  this.friction = 1;
  this.color = color;
  this.floorColor = 'lightgrey';

  this.vertices = vertices;
  this.neighbours = [];
  this.enemies = [];
  this.players = [];
  this.effects = [];

  this.addVertex = function (vertex) {
    this.vertices.push(vertex);
    this.vCount++;
  };

  this.addNeighbour = function (sector) {
    this.neighbours.push(sector);
  };

  this.getWallNeighbour = function (vertex1, vertex2) {
    for (let sector of this.neighbours) {
      if(sector.containsVertices(vertex1, vertex2)) {
        return sector;
      }
    }
    return null;
  };

  this.containsVertices = function (vertex1, vertex2) {
    let found = 0;
    for (let vertex of this.vertices) {
      if (vertex.equal(vertex1) || vertex.equal(vertex2))
        found++;
    }

    return found == 2;
  };

  this.draw = function () {
    config.c.beginPath();

    for(let i = 0; i < this.vertices.length; i++) {
      let a = this.vertices[i], b = this.vertices[i + 1];

      //Loop around for last corner
      if (i == this.vertices.length-1) {
        b = vertices[0];
      }

      if (i == 0) {
        config.c.moveTo(vertices[0].x, vertices[0].y);

        for (let n of this.neighbours) {
          if (n.containsVertices(a, b)) {
            config.c.moveTo(b.x, b.y);
            i++;
          }
        }

      } else {
        let portal = false;

        for (let n of this.neighbours){
          if(n.containsVertices(a, b)) {
            if (i == 1) {
              config.c.moveTo(a.x, a.y);
            } else {
              config.c.lineTo(a.x, a.y);
            }
            config.c.lineTo(a.x, a.y);
            config.c.moveTo(b.x, b.y);

            if (i == this.vertices.length-1) {
              config.c.moveTo(b.x, b.y);
            }

            portal = true;
          }
        }

        if (!portal) {
          config.c.lineTo(a.x, a.y);

          if (i == this.vertices.length-1) {
            config.c.lineTo(b.x, b.y);
          }
        }
      }

    }

    config.c.strokeStyle = color;
    config.c.strokeWidth = 2;
    config.c.stroke();
    config.c.closePath();

    this.drawFloor();
  };

  this.drawFloor = function () {
    config.c.save();
    config.c.beginPath();

    for (let [index, vertex]of this.vertices.entries()) {
      if (index == 0) {
        config.c.moveTo(vertex.x, vertex.y);
      } else {
        config.c.lineTo(vertex.x, vertex.y);
      }
    }

    config.c.lineTo(this.vertices[0].x, this.vertices[0].y);
    config.c.fillStyle = this.floorColor;
    config.c.fill();
    config.c.closePath();
    config.c.restore();
  };

  this.update = function () {
    for (let [index, enemy] of this.enemies.entries()) {
      //todo: update enemy here
      if(enemy.hp <= 0 && enemy.bullets.length == 0) {
        this.enemies.splice(index, 1);
      }
    }

    for (let [index, effect] of this.effects.entries()) {
      //todo: update enemy here
      if(effect.lifetime <= 0) {
        this.effects.splice(index, 1);
      }
    }
  };

  this.removePlayer = function (player) {
    this.players.splice(this.players.indexOf(player));
  };

  this.setFloorColor = function (color) {
    this.floorColor = color;
  };

  this.setFriction = function (friction) {
    this.friction = friction;
  };

  this.addPlayer = function (player) {
    this.players.push(player);
  };

  this.addEnemy = function (enemy) {
    this.enemies.push(enemy);
  };

  this.setEnemy = function (enemies) {
    this.enemies = enemies;
  };

  this.spawnEnemy = function () {
    let enemyVertex = this.randomVertex(config.enemyRadius);
    let enemy = new Enemy(enemyVertex.x, enemyVertex.y, 3, this.id, config.entityId++);
    config.enemies.push(enemy);
    this.addEnemy(enemy);
  };

  this.enterSector = function (player) {
    this.addPlayer(player);

    let random = util.randomIntFromRange(1,10);

    if (random >= 10) {
      this.spawnEnemy();
    } else if (random >= 8 && random <= 9) {
      let vertex = this.randomVertex();
      this.effects.push(new RapidFire(vertex.x, vertex.y, this, 'red', 400));
    }
  };

  this.spawnEffects = function () {
    let random = util.randomIntFromRange(1,10);

    if (random >= 4 && random <= 9) {
      let vertex = this.randomVertex();
      this.effects.push(new RapidFire(vertex.x, vertex.y, this, 'red', 400));
    }
  };

  /*
  |-------------------------------------------------------------------------------------------------------------------
  | Random vertex used to spawn new entity inside sector
  |-------------------------------------------------------------------------------------------------------------------
  | Default param dtw (Distance from wall) is used to avoid entity to overlap walls and openings
  */

  this.randomVertex = function (dfw = 0) {
    let rangeXY = this.findMaxAndMin();
    let newPoint = true;
    let point = null;
    
    while (newPoint) {
      point = new Vertex(
        util.randomIntFromRange(rangeXY.minX + dfw, rangeXY.maxX - dfw),
        util.randomIntFromRange(rangeXY.minY + dfw, rangeXY.maxY - dfw)
      );

      newPoint = !this.insideSector(point);
    }

    return point;
  };

  this.findMaxAndMin = function () {
    let minX = this.vertices[0].x;
    let maxX = this.vertices[0].x;
    let minY = this.vertices[0].y;
    let maxY = this.vertices[0].y;

    for (let vertex of this.vertices) {
      if (vertex.x < minX) {
        minX = vertex.x;
      }

      if (vertex.x > maxX) {
        maxX = vertex.x;
      }

      if (vertex.y < minY) {
        minY = vertex.y;
      }

      if (vertex.y > maxY) {
        maxY = vertex.y;
      }
    }

    return {
      'minX': minX,
      'maxX': maxX,
      'minY': minY,
      'maxY': maxY
    };
  };

  this.insideSector = function (vertex) {
    let vertices = this.vertices;
    let   i, j = vertices.length-1;
    let inside = false;

    for (i = 0; i < vertices.length; i++) {
      if ((vertices[i].y < vertex.y && vertices[j].y >= vertex.y
        ||   vertices[j].y < vertex.y && vertices[i].y >= vertex.y)
        &&  (vertices[i].x <= vertex.x || vertices[j].x <= vertex.x)) {

        inside = inside ^ ((vertices[i].x + (vertex.y - vertices[i].y)
                    / (vertices[j].y - vertices[i].y)
                    * (vertices[j].x - vertices[i].x) < vertex.x));
      }
      j=i;
    }

    return inside;
  };

  this.spawnEffects();
};