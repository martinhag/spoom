import config from '../util/config';
import * as vectorUtil from '../util/vector_util';
import Vertex from './Vertex';
import Enemy from './Enemy';
import Player from './Player';

export default Sector;

// Sector
function Sector(id, vertices, color) {
  this.id = id;
  this.vCount = vertices.length;
  this.friction = 1;
  this.color = color;
  this.floorColor = 'lightgrey';

  this.vertices = vertices;
  this.neighbours = [];
  this.enemies = [];
  this.players = [];

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
          config.c.lineTo(a.x, a.y)

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
  };

  this.update = function () {
    this.draw();

    for (let [index, enemy] of this.enemies.entries()) {
      //todo: update enemy here
      if(enemy.hp <= 0 && enemy.bullets.length == 0) {
        this.enemies.splice(index, 1);
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

  this.addPlayer= function (player) {
    this.players.push(player);
  };

  this.addEnemy= function (enemy) {
    this.enemies.push(enemy);
  };

  this.setEnemy= function (enemies) {
    this.enemies = enemies;
  };
}