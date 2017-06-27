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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomIntFromRange = randomIntFromRange;
exports.randomColor = randomColor;
exports.getDistance = getDistance;
// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function getDistance(x1, y1, x2, y2) {
  var xDistance = x2 - x1;
  var yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = clamp;
exports.intersectBox = intersectBox;
exports.overlap = overlap;
exports.vcp = vcp;
exports.pointSide = pointSide;
exports.intersect = intersect;
// Utility Functions

//if input is higher than max or lower than min, return closest option
function clamp(input, min, max) {
  return Math.min(Math.max(input, min), max);
}

//does the two boxes intersect?
function intersectBox(x0, y0, x1, y1, x2, y2, x3, y3) {
  return overlap(x0, x1, x2, x3) && overlap(y0, y1, y2, y3);
}

//find out if number-ranges overlap. Used to determine intersects
function overlap(a0, a1, b0, b1) {
  return Math.min(a0, a1) <= Math.max(b0, b1) && Math.min(b0, b1) <= Math.max(a0, a1);
}

function vcp(x0, y0, x1, y1) {
  return x0 * y1 - x1 * y0;
}

function pointSide(px, py, x0, y0, x1, y1) {
  return vcp(x1 - x0, y1 - y0, px - x0, py - y0);
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  var pos = {};

  pos.x = vcp(vcp(x1, y1, x2, y2), x1 - x2, vcp(x3, y3, x4, y4), x3 - x4) / vcp(x1 - x2, y1 - y2, x3 - x4, y3 - y4);

  pos.y = vcp(vcp(x1, y1, x2, y2), y1 - y2, vcp(x3, y3, x4, y4), y3 - y4) / vcp(x1 - x2, y1 - y2, x3 - x4, y3 - y4);

  return pos;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _canvasUtil = __webpack_require__(0);

var util = _interopRequireWildcard(_canvasUtil);

var _vector_util = __webpack_require__(1);

var vectorUtil = _interopRequireWildcard(_vector_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Initial Setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

var colors = ['black', 'red', 'blue', 'grey'];

var map = {};

var commandKeys = [224, 17, 91];

var moveSpeed = 3;
var movementPenalty = 0.4;

// Event Listeners
addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  // init();
});

onkeydown = onkeyup = function onkeyup(event) {
  if (!commandKeys.indexOf(event.keyCode)) {
    event.preventDefault();
  }
  map[event.keyCode] = event.type == 'keydown';
};

// Player
function Player(x, y) {
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.width = 15;
  this.height = 9;
  this.currentSector = undefined;

  this.bullets = [];
  this.bulletDelay = 15;
  this.lastBullet = this.bulletDelay;

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

    this.lastBullet++;

    this.draw();
  };

  this.draw = function () {
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(Math.cos(this.angle) * 15 + this.x, Math.sin(this.angle) * 15 + this.y);
    c.strokeStyle = 'red';
    c.strokeWidth = 2;
    c.stroke();
    c.closePath();

    c.save();
    c.beginPath();
    c.translate(this.x + this.width / 2 - this.width / 2, this.y + this.height / 2 - this.height / 2);
    c.rotate(this.angle);
    c.fillStyle = 'black';
    c.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    c.fill();
    c.stroke();
    c.closePath();
    c.restore();
  };

  this.fire = function () {
    if (this.lastBullet >= this.bulletDelay) {
      this.bullets.push(new Bullet(this.x, this.y, Math.cos(this.angle) + this.x - this.x, Math.sin(this.angle) + this.y - this.y));
      this.lastBullet = 0;
    }
  };

  this.move = function (vecAddition) {
    this.x += vecAddition[0];
    this.y += vecAddition[1];
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

        // //will you slide past this wall?
        if ((Math.min(a.x, b.x) > this.x + vecAddition[0] || this.x + vecAddition[0] > Math.max(a.x, b.x)) && (Math.min(a.y, b.y) > this.y + vecAddition[1] || this.y + vecAddition[1] > Math.max(a.y, b.y))) {
          //if so, stop player
          vecAddition[0] = 0;
          vecAddition[1] = 0;
        }
      }
    }

    this.move(vecAddition);
  };

  this.checkForPortal = function (n, vecAddition, a, b) {
    if (n.containsVertices(a, b)) {
      // let hole_low  = n < 0 ?  9e9 : max(getSector()->floor(), n->floor());//height of the heigest floor - gives opening
      // let hole_high = n < 0 ? -9e9 : min(getSector()->ceiling(),  n->ceiling());//height of the lowest floor- gives opening
      // let floor_diff = n->floor() - getSector()->floor();// height differens of sector floors

      //is this wall a door? and if so, is it locked?
      // door* door_ = n->getWallDoor(a,b);
      // bool isDoorLocked = (door_ != NULL && door_->doorLocked());

      // can player walk/jump through opening?
      // if(((hole_high - hole_low) >= ((isCrouching ? CROUCHHEIGHT : BODYHEIGHT)+HEADSIZE)) && (z() <= hole_high) && !isDoorLocked &&
      //   ((!isFalling && floor_diff <= KNEEHEIGHT) || (isFalling && z()-KNEEHEIGHT >= hole_low)))
      // {
      this.setSector(n.id);
      //after changing sector, will you hit a wall?
      if ((Math.min(a.x, b.x) > this.x + vecAddition[0] || this.x + vecAddition[0] > Math.max(a.x, b.x)) && (Math.min(a.y, b.y) > this.y + vecAddition[1] || this.y + vecAddition[1] > Math.max(a.y, b.y))) {
        //if so, stop player
        vecAddition[0] = 0;
        vecAddition[1] = 0;
      }
      this.move(vecAddition);

      //sets default_z to floor + BodyHeight. Player will move towards this next frame
      // default_z = getSector()->floor() + BODYHEIGHT;
      // setVelocity(velo);		//if we fall after sector-change we fall forward.
      return true;
      // }
    }
    return false;
  };

  this.setSector = function (id) {
    this.currentSector = id;
  };

  this.getSector = function () {
    var _this = this;

    return sectors.filter(function (sector) {
      return sector.id === _this.currentSector;
    })[0];
  };
}

// Bullet
function Bullet(x, y, dx, dy) {
  this.x = x;
  this.y = y;
  this.radius = 2;
  this.fireSpeed = 5;
  this.dx = dx * this.fireSpeed;
  this.dy = dy * this.fireSpeed;
  this.lifetime = 60;

  this.update = function () {
    this.x += this.dx;
    this.y += this.dy;
    this.lifetime -= 1;

    if (this.lifetime > 0) {
      this.draw();
    }
  };

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = 'red';
    c.fill();
    c.closePath();
  };

  this.delete = function () {
    delete this;
  };
}

// Vertex
function Vertex(x, y) {
  this.x = x;
  this.y = y;

  this.equal = function (other) {
    return this.x == other.x && this.y == other.y;
  };
}

// Sector
function Sector(id, vertices, color) {
  this.id = id;
  this.vCount = vertices.length;
  this.color = color;

  this.vertices = vertices;
  this.neighbours = [];

  this.addVertex = function (vertex) {
    this.vertices.push(vertex);
    this.vCount++;
  };

  this.addNeighbour = function (sector) {
    this.neighbours.push(sector);
  };

  this.getWallNeighbour = function (vertex1, vertex2) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.neighbours[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var sector = _step3.value;

        if (sector.containsVertices(vertex1, vertex2)) {
          return sector;
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

    return null;
  };

  this.containsVertices = function (vertex1, vertex2) {
    var found = 0;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = this.vertices[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var vertex = _step4.value;

        if (vertex.equal(vertex1) || vertex.equal(vertex2)) found++;
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

    return found == 2;
  };

  this.draw = function () {
    c.beginPath();

    for (var i = 0; i < this.vertices.length; i++) {
      var a = this.vertices[i],
          b = this.vertices[i + 1];

      //Loop around for last corner
      if (i == this.vertices.length - 1) {
        b = vertices[0];
      }

      if (i == 0) {
        c.moveTo(vertices[0].x, vertices[0].y);

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.neighbours[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var n = _step5.value;

            if (n.containsVertices(a, b)) {
              c.moveTo(b.x, b.y);
              i++;
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
      } else {
        var portal = false;

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = this.neighbours[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _n = _step6.value;

            if (_n.containsVertices(a, b)) {
              if (i == 1) {
                c.moveTo(a.x, a.y);
              } else {
                c.lineTo(a.x, a.y);
              }
              c.lineTo(a.x, a.y);
              c.moveTo(b.x, b.y);

              if (i == this.vertices.length - 1) {
                c.moveTo(b.x, b.y);
              }

              portal = true;
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

        if (!portal) {
          c.lineTo(a.x, a.y);

          if (i == this.vertices.length - 1) {
            c.lineTo(b.x, b.y);
          }
        }
      }
    }

    c.strokeStyle = color;
    c.strokeWidth = 2;
    c.stroke();
    c.closePath();
  };
}

function Enemy(x, y, hp, sector) {
  this.x = x;
  this.y = y;
  this.color = 'yellow';
  this.radius = 20;

  this.hp = hp;
  this.sector = sector;

  this.isHit = function () {
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = player.bullets[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var bullet = _step7.value;

        if (util.getDistance(bullet.x, bullet.y, this.x, this.y) < bullet.radius + this.radius && this.hp > 0) {
          this.radius -= 5;
          bullet.lifetime = 0;
          this.hp--;
        }
        if (this.hp == 0) {
          console.log('dead');
          this.color = 'red';
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

  this.update = function () {
    this.isHit();
    this.draw();
  };

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.strokeStyle = 'black';
    c.stroke();
    c.closePath();
  };

  this.setSector = function (id) {
    this.currentSector = id;
  };

  this.getSector = function () {
    var _this2 = this;

    return sectors.filter(function (sector) {
      return sector.id === _this2.sector;
    })[0];
  };
}

// Implementation
var player = new Player(150, 100);

var enemys = [];
var sectors = [];

function handleInput() {
  var vecAddition = [0, 0];

  //up - unused
  if (map[38]) {
    console.log('unused - up');
  }
  //left - move player angle up (left)
  if (map[39]) {
    player.angle += 0.05;
  }
  //right - move player angle down (right)
  if (map[37]) {
    player.angle -= 0.05;
  }
  //down - unused
  if (map[40]) {
    console.log('unused - down');
  }
  //a - move player left
  if (map[65]) {
    vecAddition[0] += Math.sin(player.angle) * moveSpeed * movementPenalty;
    vecAddition[1] -= Math.cos(player.angle) * moveSpeed * movementPenalty;
  }
  //d - move player right
  if (map[68]) {
    vecAddition[0] -= Math.sin(player.angle) * moveSpeed * movementPenalty;
    vecAddition[1] += Math.cos(player.angle) * moveSpeed * movementPenalty;
  }
  //w - move player up
  if (map[87]) {
    vecAddition[0] += Math.cos(player.angle) * moveSpeed;
    vecAddition[1] += Math.sin(player.angle) * moveSpeed;
  }
  //s - move player down
  if (map[83]) {
    vecAddition[0] -= Math.cos(player.angle) * moveSpeed * movementPenalty;
    vecAddition[1] -= Math.sin(player.angle) * moveSpeed * movementPenalty;
  }
  //fire bullet
  if (map[32]) {
    player.fire();
  }

  player.updatePos(vecAddition);
}

function init() {
  var vertices1 = [],
      vertices2 = [],
      vertices3 = [],
      vertices4 = [];
  vertices1.push(new Vertex(100, 75));
  vertices1.push(new Vertex(300, 75));
  vertices1.push(new Vertex(300, 125));
  vertices1.push(new Vertex(300, 175));
  vertices1.push(new Vertex(300, 250));
  vertices1.push(new Vertex(100, 250));

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
  vertices4.push(new Vertex(50, 400));

  var sector1 = new Sector(1, vertices1, 'red');
  var sector2 = new Sector(2, vertices2, 'blue');
  var sector3 = new Sector(3, vertices3, 'green');
  var sector4 = new Sector(4, vertices4, 'silver');

  sector1.addNeighbour(sector2);
  sector2.addNeighbour(sector1);
  sector2.addNeighbour(sector3);
  sector3.addNeighbour(sector2);
  sector3.addNeighbour(sector4);
  sector4.addNeighbour(sector3);

  sectors.push(sector1);
  sectors.push(sector2);
  sectors.push(sector3);
  sectors.push(sector4);

  player.setSector(1);

  enemys.push(new Enemy(200, 200, 3, 1));
}

function update() {
  handleInput();
  player.update();

  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = sectors[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var sector = _step8.value;

      sector.draw();
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

  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;
  var _iteratorError9 = undefined;

  try {
    for (var _iterator9 = enemys[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
      var enemy = _step9.value;

      enemy.update();
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
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  update();
}

init();
animate();

/***/ })
/******/ ]);
//# sourceMappingURL=canvas.bundle.js.map