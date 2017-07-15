/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  // Initial Setup
  canvas: null,
  c: null,
  socket: null,
  xView: 280,
  yView: 170,

  // Active keys
  map: {},

  // Objects and arrays
  player: null,
  players: [],
  sectors: [],
  enemies: [],

  // Indexes
  entityId: 1,

  // Game values and arrays
  playerMaxHp: 5,
  moveSpeed: 3,
  movementPenalty: 0.6,
  backwordsSpeed: 0.3,
  angleAdjustments: 0.05,
  enemyRadius: 20,
  colors: ['black', 'red', 'blue', 'grey'],

  // Game setup
  commandKeys: [224, 17, 91]

};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var config = __webpack_require__(0);
var vectorUtil = __webpack_require__(6);
var Sector = __webpack_require__(2);
var Bullet = __webpack_require__(7);

module.exports = Player;

// Player
function Player(x, y, id) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.width = 15;
  this.height = 9;
  this.maxHp = config.playerMaxHp;
  this.hp = this.maxHp;
  this.currentSector = undefined;

  this.vecAddition = [];
  this.bullets = [];
  this.bulletDelay = 15;
  this.lastBullet = this.bulletDelay;

  // effects
  this.activeEffects = {};
  this.speedAddition = 1;
  this.fireAddition = 1;
  this.fireDelay = 1;

  this.update = function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.bullets.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ref = _step.value;

        var _ref2 = _slicedToArray(_ref, 2);

        var index = _ref2[0];
        var bullet = _ref2[1];

        bullet.update();
        if (bullet.lifetime <= 0) {
          this.bullets.splice(index, 1);
          bullet.delete();
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this.handleEffects();

    this.lastBullet++;
  };

  this.fire = function () {
    if (this.lastBullet >= this.bulletDelay) {
      this.bullets.push(new Bullet(this.x, this.y, Math.cos(this.angle) + this.x - this.x, Math.sin(this.angle) + this.y - this.y, this.getSector(), 60 * this.fireDelay, 5 * this.fireAddition, 'rgb(255,215,0)', this));
      this.lastBullet = 0;
    }
  };

  this.move = function () {
    var prevX = this.x;
    var prevY = this.y;

    this.x += this.vecAddition[0] * this.getSector().friction;
    this.y += this.vecAddition[1] * this.getSector().friction;

    config.xView = -this.x;
    config.yView = -this.y;

    if (prevX !== this.x || prevY !== this.y) {
      config.socket.emit('updatePlayer', {
        x: this.x,
        y: this.y,
        angle: undefined,
        id: config.socket.id
      });
    }
  };

  this.updateAngle = function (up) {
    if (up) {
      this.angle += config.angleAdjustments;
    } else {
      this.angle -= config.angleAdjustments;
    }

    config.socket.emit('updatePlayer', {
      x: undefined,
      y: undefined,
      angle: this.angle,
      id: config.socket.id
    });
  };

  this.updatePos = function (vecAddition) {
    var vertices = this.getSector().vertices;
    var neighbours = this.getSector().neighbours;

    for (var i = 0; i < vertices.length; i++) {
      var a = vertices[i],
          b = vertices[i + 1];

      //Loop around for last corner
      if (i == vertices.length - 1) {
        b = vertices[0];
      }

      if (vectorUtil.intersectBox(this.x, this.y, this.x + vecAddition[0], this.y + vecAddition[1], a.x, a.y, b.x, b.y) && vectorUtil.pointSide(this.x + vecAddition[0], this.y + vecAddition[1], a.x, a.y, b.x, b.y) < 0) {

        // Check if its a neighbour sector on the other side of wall
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = neighbours[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var n = _step2.value;

            if (this.checkForPortal(n, vecAddition, a, b)) //did we hit a portal?
              return true;
          }

          //Bumps into a wall! Slide along the wall.
          // This formula is from Wikipedia article "vector projection".
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var xd = b.x - a.x,
            yd = b.y - a.y;
        vecAddition[0] = xd * (vecAddition[0] * xd + yd * vecAddition[1]) / (xd * xd + yd * yd);
        vecAddition[1] = yd * (vecAddition[0] * xd + yd * vecAddition[1]) / (xd * xd + yd * yd);

        // //will you slide past this wall? - Removed for now
        // if( (Math.min(a.x, b.x) > this.x+vecAddition[0] || this.x+vecAddition[0] > Math.max(a.x, b.x)) &&
        //   (Math.min(a.y, b.y) > this.y+vecAddition[1] || this.y+vecAddition[1] > Math.max(a.y, b.y))  ){
        //   //if so, stop player
        //   vecAddition[0] = 0;
        //   vecAddition[1] = 0;
        // }
      }
    }
    this.vecAddition = vecAddition;
    this.move();
  };

  this.checkForPortal = function (n, vecAddition, a, b) {
    if (n.containsVertices(a, b)) {
      //is this wall a door? and if so, is it locked?
      // door* door_ = n->getWallDoor(a,b);
      // bool isDoorLocked = (door_ != NULL && door_->doorLocked());

      this.getSector().removePlayer(this);
      this.setSector(n.id);
      this.getSector().enterSector(this);

      //after changing sector, will you hit a wall?
      if ((Math.min(a.x, b.x) > this.x + vecAddition[0] || this.x + vecAddition[0] > Math.max(a.x, b.x)) && (Math.min(a.y, b.y) > this.y + vecAddition[1] || this.y + vecAddition[1] > Math.max(a.y, b.y))) {
        //if so, stop player
        vecAddition[0] = 0;
        vecAddition[1] = 0;
      }
      this.vecAddition = vecAddition;
      this.move();

      return true;
    }
    return false;
  };

  this.setSector = function (id) {
    this.currentSector = id;
  };

  this.getSector = function () {
    var _this = this;

    return config.sectors.filter(function (sector) {
      return sector.id === _this.currentSector;
    })[0];
  };

  this.hit = function () {
    if (this.hp > 1) {
      this.hp--;
    } else {
      console.log('GAME OVER');
    }
  };

  this.boostFire = function (effect, duration, delay) {
    this.activeEffects['fire'] = {
      effect: effect,
      duration: duration,
      delay: delay
    };
  };

  this.handleEffects = function () {
    // handle boostFire effect
    if (this.activeEffects['fire'] && this.activeEffects['fire'].duration > 0) {
      this.fireAddition = this.activeEffects['fire'].effect;
      this.fireDelay = this.activeEffects['fire'].delay;
      this.activeEffects['fire'].duration -= 1;
    } else {
      this.fireAddition = 1;
      this.fireDelay = 1;
    }
  };

  this.draw = function () {
    config.c.beginPath();
    config.c.moveTo(this.x, this.y);
    config.c.lineTo(Math.cos(this.angle) * 15 + this.x, Math.sin(this.angle) * 15 + this.y);
    config.c.strokeStyle = 'dimgrey';
    config.c.lineWidth = 4;
    config.c.stroke();
    config.c.closePath();
    config.c.lineWidth = 1;

    config.c.save();
    config.c.beginPath();
    config.c.translate(this.x + this.width / 2 - this.width / 2, this.y + this.height / 2 - this.height / 2);
    config.c.rotate(this.angle);
    config.c.fillStyle = 'black';
    config.c.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    config.c.fill();
    config.c.stroke();
    config.c.closePath();
    config.c.restore();

    //HP bar over player
    config.c.beginPath();
    config.c.moveTo(this.x - this.width / 2, this.y - this.height * 2.2);
    config.c.lineTo(this.x + this.width / 2, this.y - this.height * 2.2);
    config.c.strokeStyle = 'red';
    config.c.lineWidth = 3;
    config.c.stroke();
    config.c.closePath();
    config.c.lineWidth = 1;

    config.c.beginPath();
    config.c.moveTo(this.x - this.width / 2, this.y - this.height * 2.2);
    config.c.lineTo(this.x + this.width / this.maxHp * this.hp - this.width / 2, this.y - this.height * 2.2);
    config.c.strokeStyle = 'green';
    config.c.lineWidth = 3;
    config.c.stroke();
    config.c.closePath();
    config.c.lineWidth = 1;
  };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var config = __webpack_require__(0);
var vectorUtil = __webpack_require__(6);
var util = __webpack_require__(4);
var Vertex = __webpack_require__(3);
var Enemy = __webpack_require__(5);
var Player = __webpack_require__(1);
var RapidFire = __webpack_require__(8);

module.exports = Sector;

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
  this.effects = [];

  this.addVertex = function (vertex) {
    this.vertices.push(vertex);
    this.vCount++;
  };

  this.addNeighbour = function (sector) {
    this.neighbours.push(sector);
  };

  this.getWallNeighbour = function (vertex1, vertex2) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.neighbours[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var sector = _step.value;

        if (sector.containsVertices(vertex1, vertex2)) {
          return sector;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return null;
  };

  this.containsVertices = function (vertex1, vertex2) {
    var found = 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.vertices[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var vertex = _step2.value;

        if (vertex.equal(vertex1) || vertex.equal(vertex2)) found++;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return found == 2;
  };

  this.draw = function () {
    config.c.beginPath();

    for (var i = 0; i < this.vertices.length; i++) {
      var a = this.vertices[i],
          b = this.vertices[i + 1];

      //Loop around for last corner
      if (i == this.vertices.length - 1) {
        b = vertices[0];
      }

      if (i == 0) {
        config.c.moveTo(vertices[0].x, vertices[0].y);

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.neighbours[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var n = _step3.value;

            if (n.containsVertices(a, b)) {
              config.c.moveTo(b.x, b.y);
              i++;
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } else {
        var portal = false;

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.neighbours[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _n = _step4.value;

            if (_n.containsVertices(a, b)) {
              if (i == 1) {
                config.c.moveTo(a.x, a.y);
              } else {
                config.c.lineTo(a.x, a.y);
              }
              config.c.lineTo(a.x, a.y);
              config.c.moveTo(b.x, b.y);

              if (i == this.vertices.length - 1) {
                config.c.moveTo(b.x, b.y);
              }

              portal = true;
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        if (!portal) {
          config.c.lineTo(a.x, a.y);

          if (i == this.vertices.length - 1) {
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

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = this.vertices.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _ref = _step5.value;

        var _ref2 = _slicedToArray(_ref, 2);

        var index = _ref2[0];
        var vertex = _ref2[1];

        if (index == 0) {
          config.c.moveTo(vertex.x, vertex.y);
        } else {
          config.c.lineTo(vertex.x, vertex.y);
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    config.c.lineTo(this.vertices[0].x, this.vertices[0].y);
    config.c.fillStyle = this.floorColor;
    config.c.fill();
    config.c.closePath();
    config.c.restore();
  };

  this.update = function () {
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = this.enemies.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _ref3 = _step6.value;

        var _ref4 = _slicedToArray(_ref3, 2);

        var index = _ref4[0];
        var enemy = _ref4[1];

        //todo: update enemy here
        if (enemy.hp <= 0 && enemy.bullets.length == 0) {
          this.enemies.splice(index, 1);
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = this.effects.entries()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var _ref5 = _step7.value;

        var _ref6 = _slicedToArray(_ref5, 2);

        var _index = _ref6[0];
        var effect = _ref6[1];

        //todo: update enemy here
        if (effect.lifetime <= 0) {
          this.effects.splice(_index, 1);
        }
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
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
    var enemyVertex = this.randomVertex(config.enemyRadius);
    var enemy = new Enemy(enemyVertex.x, enemyVertex.y, 3, this.id, config.entityId++);
    config.enemies.push(enemy);
    this.addEnemy(enemy);
  };

  this.enterSector = function (player) {
    this.addPlayer(player);

    var random = util.randomIntFromRange(1, 10);

    if (random >= 10) {
      this.spawnEnemy();
    } else if (random >= 8 && random <= 9) {
      var vertex = this.randomVertex();
      this.effects.push(new RapidFire(vertex.x, vertex.y, this, 'red', 400));
    }
  };

  this.spawnEffects = function () {
    var random = util.randomIntFromRange(1, 10);

    if (random >= 4 && random <= 9) {
      var vertex = this.randomVertex();
      this.effects.push(new RapidFire(vertex.x, vertex.y, this, 'red', 400));
    }
  };

  /*
  |-------------------------------------------------------------------------------------------------------------------
  | Random vertex used to spawn new entity inside sector
  |-------------------------------------------------------------------------------------------------------------------
  | Default param dtw (Distance from wall) is used to avoid entity to overlap walls and openings
  */

  this.randomVertex = function () {
    var dfw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var rangeXY = this.findMaxAndMin();
    var newPoint = true;
    var point = null;

    while (newPoint) {
      point = new Vertex(util.randomIntFromRange(rangeXY.minX + dfw, rangeXY.maxX - dfw), util.randomIntFromRange(rangeXY.minY + dfw, rangeXY.maxY - dfw));

      newPoint = !this.insideSector(point);
    }

    return point;
  };

  this.findMaxAndMin = function () {
    var minX = this.vertices[0].x;
    var maxX = this.vertices[0].x;
    var minY = this.vertices[0].y;
    var maxY = this.vertices[0].y;

    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = this.vertices[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var vertex = _step8.value;

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
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
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
    var vertices = this.vertices;
    var i = void 0,
        j = vertices.length - 1;
    var inside = false;

    for (i = 0; i < vertices.length; i++) {
      if ((vertices[i].y < vertex.y && vertices[j].y >= vertex.y || vertices[j].y < vertex.y && vertices[i].y >= vertex.y) && (vertices[i].x <= vertex.x || vertices[j].x <= vertex.x)) {

        inside = inside ^ vertices[i].x + (vertex.y - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < vertex.x;
      }
      j = i;
    }

    return inside;
  };

  this.spawnEffects();
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Vertex;

function Vertex(x, y) {
  this.x = x;
  this.y = y;

  this.equal = function (other) {
    return this.x == other.x && this.y == other.y;
  };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  // Utility Functions
  randomIntFromRange: function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  randomColor: function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  },

  getDistance: function getDistance(x1, y1, x2, y2) {
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var config = __webpack_require__(0);
var util = __webpack_require__(4);
var Vertex = __webpack_require__(3);
var Sector = __webpack_require__(2);
var Player = __webpack_require__(1);
var Bullet = __webpack_require__(7);
var RapidFire = __webpack_require__(8);

module.exports = Enemy;

function Enemy(x, y, hp, sector, id) {
  this.x = x;
  this.y = y;
  this.color = 'yellow';
  this.radius = config.enemyRadius;
  this.id = id;

  this.attackDelay = 140;
  this.lastAttack = 0;
  this.numberOfBullets = 9;
  this.bullets = [];

  this.hp = hp;
  this.sector = sector;

  this.hit = function () {
    this.radius -= 5;
    this.hp--;
  };

  this.update = function () {

    if (this.lastAttack >= this.attackDelay && this.hp > 0) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.getSector().players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var player = _step.value;

          this.attack();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.bullets.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _ref = _step2.value;

        var _ref2 = _slicedToArray(_ref, 2);

        var index = _ref2[0];
        var bullet = _ref2[1];

        bullet.update();

        if (bullet.lifetime <= 0) {
          this.bullets.splice(index, 1);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    this.lastAttack++;
  };

  this.attack = function () {
    var randomOffset = util.randomIntFromRange(-90, 90);

    for (var i = 0; i < this.numberOfBullets; i++) {
      var angle = 360 / this.numberOfBullets * (i + 1) * Math.PI / 180 + randomOffset;
      var speed = util.randomIntFromRange(2, 4);

      this.bullets.push(new Bullet(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, this.getSector(), 140, 1, 'red', this));
    }
    this.lastAttack = 0;
  };

  this.draw = function () {
    config.c.beginPath();
    config.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    config.c.fillStyle = this.color;
    config.c.fill();
    config.c.strokeStyle = 'black';
    config.c.stroke();
    config.c.closePath();
  };

  this.setSector = function (id) {
    this.currentSector = id;
  };

  this.getSector = function () {
    var _this = this;

    return config.sectors.filter(function (sector) {
      return sector.id === _this.sector;
    })[0];
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {

  // Utility Functions

  //if input is higher than max or lower than min, return closest option
  clamp: function clamp(input, min, max) {
    return Math.min(Math.max(input, min), max);
  },

  //does the two boxes intersect?
  intersectBox: function intersectBox(x0, y0, x1, y1, x2, y2, x3, y3) {
    return this.overlap(x0, x1, x2, x3) && this.overlap(y0, y1, y2, y3);
  },

  //find out if number-ranges overlap. Used to determine intersects
  overlap: function overlap(a0, a1, b0, b1) {
    return Math.min(a0, a1) <= Math.max(b0, b1) && Math.min(b0, b1) <= Math.max(a0, a1);
  },

  vcp: function vcp(x0, y0, x1, y1) {
    return x0 * y1 - x1 * y0;
  },

  pointSide: function pointSide(px, py, x0, y0, x1, y1) {
    return this.vcp(x1 - x0, y1 - y0, px - x0, py - y0);
  },

  intersect: function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    var pos = {};

    pos.x = this.vcp(this.vcp(x1, y1, x2, y2), x1 - x2, this.vcp(x3, y3, x4, y4), x3 - x4) / this.vcp(x1 - x2, y1 - y2, x3 - x4, y3 - y4);

    pos.y = this.vcp(this.vcp(x1, y1, x2, y2), y1 - y2, this.vcp(x3, y3, x4, y4), y3 - y4) / this.vcp(x1 - x2, y1 - y2, x3 - x4, y3 - y4);

    return pos;
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var config = __webpack_require__(0);
var util = __webpack_require__(4);
var vectorUtil = __webpack_require__(6);
var Vertex = __webpack_require__(3);
var Sector = __webpack_require__(2);
var Player = __webpack_require__(1);
var Enemy = __webpack_require__(5);

module.exports = Bullet;

// Bullet
function Bullet(x, y, dx, dy, sector, lifetime, fireSpeed, color, owner) {
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

    var vertices = this.sector.vertices;
    var neighbours = this.sector.neighbours;

    for (var i = 0; i < vertices.length; i++) {
      var a = vertices[i],
          b = vertices[i + 1];
      var portal = false;

      //Loop around for last corner
      if (i == vertices.length - 1) {
        b = vertices[0];
      }

      if (vectorUtil.intersectBox(this.x, this.y, this.x + this.dx, this.y + this.dy, a.x, a.y, b.x, b.y) && vectorUtil.pointSide(this.x + this.dx, this.y + this.dy, a.x, a.y, b.x, b.y) < 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {

          for (var _iterator = neighbours[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            if (n.containsVertices(a, b)) {
              this.sector = n;
              portal = true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!portal) {
          this.lifetime = 0;
        }
      }
    }

    if (this.lifetime > 0) {
      this.x += this.dx;
      this.y += this.dy;
      this.lifetime -= 1;
    }
  };

  this.hitCheckEnemy = function () {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.sector.enemies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var enemy = _step2.value;

        if (util.getDistance(enemy.x, enemy.y, this.x, this.y) < this.radius + enemy.radius && enemy.hp > 0) {
          enemy.hit();
          this.stopBullet();
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };

  this.hitCheckPlayer = function () {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.sector.players[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var player = _step3.value;

        if (util.getDistance(player.x, player.y, this.x, this.y) < this.radius + player.height) {
          player.hit();
          this.stopBullet();
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
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

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var config = __webpack_require__(0);
var util = __webpack_require__(4);
var Sector = __webpack_require__(2);
var Player = __webpack_require__(1);

module.exports = RapidFire;

// Bullet
function RapidFire(x, y, sector, color, duration) {
  this.x = x;
  this.y = y;
  this.radius = 5;
  this.sector = sector;
  this.color = color;
  this.duration = duration;
  this.effect = 1.5;
  this.fireDelay = 0.5;
  this.lifetime = 1;

  this.update = function () {
    this.hitCheckPlayer();

    // Keep effect until its picked up for now
    // if(this.lifetime > 0) {
    //   this.lifetime -= 1;
    // }
  };

  this.hitCheckPlayer = function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.sector.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var player = _step.value;

        if (util.getDistance(player.x, player.y, this.x, this.y) < this.radius + player.height) {
          player.boostFire(this.effect, this.duration, this.fireDelay);
          this.removeEffect();
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  this.draw = function () {
    config.c.beginPath();
    config.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    config.c.fillStyle = this.color;
    config.c.fill();
    config.c.closePath();
  };

  this.removeEffect = function () {
    this.lifetime = 0;
  };

  this.delete = function () {
    delete this;
  };
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var config = __webpack_require__(0);
var Player = __webpack_require__(1);

exports.handleInput = function () {
  var vecAddition = [0, 0],
      slower = false,
      back = false;

  //up - unused
  if (config.map[38]) {
    console.log('unused - up');
  }
  //left - move player angle up (left)
  if (config.map[39]) {
    config.player.updateAngle(true);
    // config.player.angle += config.angleAdjustments;
  }
  //right - move player angle down (right)
  if (config.map[37]) {
    config.player.updateAngle(false);
    // config.player.angle -= config.angleAdjustments;
  }
  //down - unused
  if (config.map[40]) {
    console.log('unused - down');
  }
  //a - move player left
  if (config.map[65]) {
    vecAddition[0] += Math.sin(config.player.angle) * config.moveSpeed;
    vecAddition[1] -= Math.cos(config.player.angle) * config.moveSpeed;
    slower = true;
  }
  //d - move player right
  if (config.map[68]) {
    vecAddition[0] -= Math.sin(config.player.angle) * config.moveSpeed;
    vecAddition[1] += Math.cos(config.player.angle) * config.moveSpeed;
    slower = true;
  }
  //w - move player up
  if (config.map[87]) {
    vecAddition[0] += Math.cos(config.player.angle) * config.moveSpeed;
    vecAddition[1] += Math.sin(config.player.angle) * config.moveSpeed;
  }
  //s - move player down
  if (config.map[83]) {
    vecAddition[0] -= Math.cos(config.player.angle) * config.moveSpeed;
    vecAddition[1] -= Math.sin(config.player.angle) * config.moveSpeed;
    back = true;
  }
  //fire bullet
  if (config.map[32]) {
    config.player.fire();
  }

  if (back) {
    vecAddition[0] = vecAddition[0] * config.backwordsSpeed;
    vecAddition[1] = vecAddition[1] * config.backwordsSpeed;
  } else if (slower) {
    vecAddition[0] = vecAddition[0] * config.movementPenalty;
    vecAddition[1] = vecAddition[1] * config.movementPenalty;
  }

  config.player.updatePos(vecAddition);
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inputHandler = __webpack_require__(9);
var Player = __webpack_require__(1);
var Vertex = __webpack_require__(3);
var Sector = __webpack_require__(2);
var Enemy = __webpack_require__(5);
var config = __webpack_require__(0);

config.socket = io();
config.socket.on('createPlayer', function (id) {
  config.player = new Player(150, 200, id);
  config.players.push(config.player);

  config.player.setSector(1);
  config.sectors[0].enterSector(config.player);

  config.socket.emit('addPlayers', JSON.stringify(config.player));
});

config.socket.on('init', function (data) {
  console.log('canvas', data);
});

config.socket.on('updatePlayers', function (data) {
  data = JSON.parse(data);
  var newPlayer = new Player(data.x, data.y, data.id);
  // Update rest of variables

  config.players.push(newPlayer);
});

config.socket.on('movePlayer', function (data) {
  var playerIndex = config.players.findIndex(function (i) {
    return i.id === data.id;
  });

  if (playerIndex !== -1) {
    var player = config.players[playerIndex];

    if (data.x !== undefined) {
      player.x = data.x;
    }
    if (data.y !== undefined) {
      player.y = data.y;
    }
    if (data.angle !== undefined) {
      player.angle = data.angle;
    }

    config.players[playerIndex] = player;
  }
});

// // Initial Setup
config.canvas = document.querySelector('canvas');
config.c = config.canvas.getContext('2d');

config.canvas.width = innerWidth;
config.canvas.height = innerHeight;

// Variables
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

// Event Listeners
addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", function () {
  config.canvas.width = innerWidth;
  config.canvas.height = innerHeight;

  // init();
});

onkeydown = onkeyup = function onkeyup(event) {
  if (!config.commandKeys.indexOf(event.keyCode)) {
    event.preventDefault();
  }
  config.map[event.keyCode] = event.type == 'keydown';
};

function init() {
  var vertices1 = [],
      vertices2 = [],
      vertices3 = [],
      vertices4 = [];
  vertices1.push(new Vertex(50, 25));
  vertices1.push(new Vertex(300, 25));
  vertices1.push(new Vertex(300, 125));
  vertices1.push(new Vertex(300, 175));
  vertices1.push(new Vertex(300, 250));
  vertices1.push(new Vertex(50, 250));

  vertices2.push(new Vertex(300, 125));
  vertices2.push(new Vertex(500, 125));
  vertices2.push(new Vertex(500, 175));
  vertices2.push(new Vertex(400, 175));
  vertices2.push(new Vertex(300, 175));

  vertices3.push(new Vertex(500, 175));
  vertices3.push(new Vertex(500, 500));
  vertices3.push(new Vertex(400, 500));
  vertices3.push(new Vertex(400, 400));
  vertices3.push(new Vertex(400, 175));

  vertices4.push(new Vertex(400, 400));
  vertices4.push(new Vertex(400, 500));
  vertices4.push(new Vertex(400, 600));
  vertices4.push(new Vertex(50, 600));
  vertices4.push(new Vertex(50, 300));
  vertices4.push(new Vertex(250, 300));
  vertices4.push(new Vertex(250, 400));

  var sector1 = new Sector(1, vertices1, 'black');
  var sector2 = new Sector(2, vertices2, 'black');
  var sector3 = new Sector(3, vertices3, 'black');
  var sector4 = new Sector(4, vertices4, 'black');
  sector4.setFloorColor('darkolivegreen');
  sector4.setFriction(0.7);

  sector1.addNeighbour(sector2);
  sector2.addNeighbour(sector1);
  sector2.addNeighbour(sector3);
  sector3.addNeighbour(sector2);
  sector3.addNeighbour(sector4);
  sector4.addNeighbour(sector3);

  config.sectors.push(sector1);
  config.sectors.push(sector2);
  config.sectors.push(sector3);
  config.sectors.push(sector4);

  // let enemyVertex = sector4.randomVertex(config.enemyRadius);
  // console.log(enemyVertex.x, enemyVertex.y);
  // let enemy = new Enemy(enemyVertex.x, enemyVertex.y, 3, 4, config.entityId++);
  // config.enemies.push(enemy);
  // sector4.addEnemy(enemy);
}

// Update all objects
function update() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = config.sectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var sector = _step.value;

      sector.update();

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = sector.effects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var effects = _step3.value;

          effects.update();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = config.enemies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var enemy = _step2.value;

      enemy.update();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  if (config.player) {
    inputHandler.handleInput();
    config.player.update();
  }
}

function draw() {
  config.c.save();
  // center "camera" over player
  config.c.translate(config.xView + config.canvas.width / 2, config.yView + config.canvas.height / 2);

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = config.sectors[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var sector = _step4.value;

      sector.draw();

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = sector.effects[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var effects = _step7.value;

          effects.draw();
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = config.enemies[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var enemy = _step5.value;
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = enemy.bullets[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var bullet = _step8.value;

          if (bullet.lifetime > 0) {
            bullet.draw();
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      if (enemy.hp > 0) {
        enemy.draw();
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = config.players[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var player = _step6.value;
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = player.bullets[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var _bullet = _step9.value;

          if (_bullet.lifetime > 0) {
            _bullet.draw();
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      player.draw();
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  config.c.restore();
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  config.c.clearRect(0, 0, config.canvas.width, config.canvas.height);
  // console.log(config.players);
  update();
  draw();
}

init();
animate();

/***/ })
/******/ ]);
//# sourceMappingURL=canvas.bundle.js.map