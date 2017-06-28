import * as util from './util/canvas-util';
import * as vectorUtil from './util/vector_util';

// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

const colors = [
  'black',
  'red',
  'blue',
  'grey'
];

const map = {};

const commandKeys = [224, 17, 91];

const moveSpeed = 3;
const movementPenalty = 0.6;
const backwordsSpeed = 0.3;
const playerMaxHp = 5;

let entityId = 1;

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

onkeydown = onkeyup = function(event){
  if(!commandKeys.indexOf(event.keyCode)) {
    event.preventDefault();
  }
  map[event.keyCode] = event.type == 'keydown';
}

// Player
function Player(x, y, id) {
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.width = 15;
  this.height = 9;
  this.hp = playerMaxHp;
  this.id = id;
  this.currentSector = undefined;

  this.vecAddition = []
  this.bullets = [];
  this.bulletDelay = 15;
  this.lastBullet = this.bulletDelay;

  this.update = function () {
    for (let [index, bullet] of this.bullets.entries()) {
      bullet.update();
      if (bullet.lifetime <= 0) {
        this.bullets.splice(index, 1);
        bullet.delete();
      }
    }

    this.lastBullet++;

    this.draw();
  };

  this.fire = function () {
    if (this.lastBullet >= this.bulletDelay) {
      this.bullets.push(
        new Bullet(
          this.x,
          this.y,
          (Math.cos(this.angle) + (this.x)) - (this.x),
          (Math.sin(this.angle) + (this.y)) - (this.y),
          this.getSector(),
          60,
          5,
          'rgb(255,215,0)',
          this
        )
      );
      this.lastBullet = 0;
    }
  };

  this.move = function () {
    this.x += this.vecAddition[0] * this.getSector().friction;
    this.y += this.vecAddition[1] * this.getSector().friction;
  };

  this.updatePos = function (vecAddition) {
    let vertices = this.getSector().vertices;
    let neighbours = this.getSector().neighbours;

    for(let i = 0; i < vertices.length; i++){
      let a = vertices[i], b = vertices[i+1];

      //Loop around for last corner
      if (i == vertices.length-1) {
        b = vertices[0];
      }

      if( vectorUtil.intersectBox(this.x , this.y, (this.x )+vecAddition[0],(this.y )+vecAddition[1], a.x, a.y, b.x, b.y) &&
        vectorUtil.pointSide((this.x )+vecAddition[0], (this.y )+vecAddition[1], a.x, a.y, b.x, b.y) < 0) {

        // Check if its a neighbour sector on the other side of wall
        for (let n of neighbours){
          if(this.checkForPortal(n, vecAddition, a, b)) //did we hit a portal?
            return true;
        }

        //Bumps into a wall! Slide along the wall.
        // This formula is from Wikipedia article "vector projection".
        let xd = b.x - a.x, yd = b.y - a.y;
        vecAddition[0] =  xd * (vecAddition[0]*xd + yd*vecAddition[1]) / (xd*xd + yd*yd);
        vecAddition[1] =  yd * (vecAddition[0]*xd + yd*vecAddition[1]) / (xd*xd + yd*yd);

        // //will you slide past this wall?
        if( (Math.min(a.x, b.x) > this.x+vecAddition[0] || this.x+vecAddition[0] > Math.max(a.x, b.x)) &&
          (Math.min(a.y, b.y) > this.y+vecAddition[1] || this.y+vecAddition[1] > Math.max(a.y, b.y))  ){
          //if so, stop player
          vecAddition[0] = 0;
          vecAddition[1] = 0;
        }

      }
    }
    this.vecAddition = vecAddition;
    this.move();
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
        if( (Math.min(a.x, b.x) > this.x+vecAddition[0] || this.x+vecAddition[0] > Math.max(a.x, b.x)) &&
          (Math.min(a.y, b.y) > this.y+vecAddition[1] || this.y+vecAddition[1] > Math.max(a.y, b.y))  ){
          //if so, stop player
          vecAddition[0] = 0;
          vecAddition[1] = 0;
        }
        this.vecAddition = vecAddition;
        this.move();

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
    return sectors.filter(sector => sector.id === this.currentSector)[0];
  };

  this.hit = function () {
    if (this.hp > 1) {
      this.hp--;
    } else {
      console.log('GAME OVER');
    }
  };

  this.draw = function () {
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(Math.cos(this.angle) * 15 + this.x, Math.sin(this.angle) * 15 + this.y);
    c.strokeStyle = 'dimgrey';
    c.lineWidth = 4;
    c.stroke();
    c.closePath();
    c.lineWidth = 1;

    c.save();
    c.beginPath();
    c.translate( (this.x + this.width/2) - (this.width/2), (this.y + this.height/2) - (this.height/2));
    c.rotate(this.angle);
    c.fillStyle = 'black';
    c.rect(-this.width/2, -this.height/2, this.width, this.height);
    c.fill();
    c.stroke();
    c.closePath();
    c.restore();

    //HP bar over player
    c.beginPath();
    c.moveTo(this.x - this.width/2, this.y - this.height * 2);
    c.lineTo(this.x + (this.width/2), this.y - this.height * 2);
    c.strokeStyle = 'red';
    c.lineWidth = 3;
    c.stroke();
    c.closePath();
    c.lineWidth = 1;

    c.beginPath();
    c.moveTo(this.x - this.width/2, this.y - this.height * 2);
    c.lineTo(this.x  + ((this.width/playerMaxHp) * this.hp) - this.width/2, this.y - this.height * 2);
    c.strokeStyle = 'green';
    c.lineWidth = 3;
    c.stroke();
    c.closePath();
    c.lineWidth = 1;
  };
}

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
    //Check if bullet hit players og enemy
    if(this.owner instanceof Player) {
      this.hitCheckEnemy();
    } else {
      this.hitCheckPlayer();
    }

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

      this.draw();
    }
  }

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
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.lineWidth = 0.3;
    c.stroke();
    c.closePath();
    c.lineWidth = 1;
  };

  this.stopBullet = function () {
    this.lifetime = 0;
  }

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
    c.beginPath();

    for(let i = 0; i < this.vertices.length; i++) {
      let a = this.vertices[i], b = this.vertices[i + 1];

      //Loop around for last corner
      if (i == this.vertices.length-1) {
        b = vertices[0];
      }

      if (i == 0) {
        c.moveTo(vertices[0].x, vertices[0].y);

        for (let n of this.neighbours) {
          if (n.containsVertices(a, b)) {
            c.moveTo(b.x, b.y);
            i++;
          }
        }

      } else {
        let portal = false;

        for (let n of this.neighbours){
          if(n.containsVertices(a, b)) {
            if (i == 1) {
              c.moveTo(a.x, a.y);
            } else {
              c.lineTo(a.x, a.y);
            }
            c.lineTo(a.x, a.y);
            c.moveTo(b.x, b.y);

            if (i == this.vertices.length-1) {
              c.moveTo(b.x, b.y);
            }

            portal = true;
          }
        }

        if (!portal) {
          c.lineTo(a.x, a.y)

          if (i == this.vertices.length-1) {
            c.lineTo(b.x, b.y);
          }
        }
      }

    }

    c.strokeStyle = color;
    c.strokeWidth = 2;
    c.stroke();
    c.closePath();

    this.drawFloor();
  };

  this.drawFloor = function () {
    c.beginPath();

    for (let [index, vertex]of this.vertices.entries()) {
      if (index == 0) {
        c.moveTo(vertex.x, vertex.y);
      } else {
        c.lineTo(vertex.x, vertex.y);
      }
    }

    c.lineTo(this.vertices[0].x, this.vertices[0].y);
    c.fillStyle = this.floorColor;
    c.fill();
    c.closePath();
  };

  this.update = function () {
    this.draw();

    for (let [index, enemy] of this.enemies.entries()) {
      enemy.update();

      if(enemy.hp <= 0 && enemy.bullets.length == 0) {
        this.enemies.splice(index, 1);
      }
    }
  }

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

function Enemy(x, y, hp, sector, id) {
  this.x = x;
  this.y = y;
  this.color = 'yellow';
  this.radius = 20;
  this.id = id;

  this.attackDelay = 140;
  this.lastAttack = this.attackDelay;
  this.bullets = [];

  this.hp = hp;
  this.sector = sector;

  this.hit = function () {
    this.radius -= 5;
    this.hp--;
  };

  this.update = function () {

    if (this.lastAttack >= this.attackDelay && this.hp > 0) {
      if (player.getSector().id == this.getSector().id) {
        this.attack();
      }
    }

    for (let [index, bullet] of this.bullets.entries()) {
      bullet.update();

      if (bullet.lifetime <= 0) {
        this.bullets.splice(index, 1);
      }
    }

    this.lastAttack++;

    if (this.hp > 0) {
      this.draw();
    }
  };

  this.attack = function () {
    for (let i = 0; i < 6; i++) {
      this.bullets.push(
        new Bullet(
          this.x,
          this.y,
          util.randomIntFromRange(-2, 2),
          util.randomIntFromRange(-2, 2),
          this.getSector(),
          140,
          1,
          'red',
          this
        )
      );
    }
    this.lastAttack = 0;
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
    return sectors.filter(sector => sector.id === this.sector)[0];
  };
}

// Implementation
let player = new Player(150, 100, entityId++);

let sectors = [];

function handleInput() {
  let vecAddition = [ 0, 0 ], slower = false, back = false;

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
    vecAddition[0] += Math.sin(player.angle) * moveSpeed;
    vecAddition[1] -= Math.cos(player.angle) * moveSpeed;
    slower = true;
  }
  //d - move player right
  if (map[68]) {
    vecAddition[0] -= Math.sin(player.angle) * moveSpeed;
    vecAddition[1] += Math.cos(player.angle) * moveSpeed;
    slower = true;
  }
  //w - move player up
  if (map[87]) {
    vecAddition[0] += Math.cos(player.angle) * moveSpeed;
    vecAddition[1] += Math.sin(player.angle) * moveSpeed;
  }
  //s - move player down
  if (map[83]) {
    vecAddition[0] -= Math.cos(player.angle) * moveSpeed;
    vecAddition[1] -= Math.sin(player.angle) * moveSpeed;
    back = true;
  }
  //fire bullet
  if (map[32]) {
    player.fire();
  }

  if (back) {
    vecAddition[0] = vecAddition[0] * backwordsSpeed;
    vecAddition[1] = vecAddition[1] * backwordsSpeed;
  } else if(slower) {
    vecAddition[0] = vecAddition[0] * movementPenalty;
    vecAddition[1] = vecAddition[1] * movementPenalty;
  }

  player.updatePos(vecAddition);
}

function init() {
  let vertices1 = [], vertices2 = [], vertices3 = [], vertices4 = [];
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

  let sector1 = new Sector(1, vertices1, 'black');
  let sector2 = new Sector(2, vertices2, 'black');
  let sector3 = new Sector(3, vertices3, 'black');
  let sector4 = new Sector(4, vertices4, 'black');
  sector4.setFloorColor('darkolivegreen');
  sector4.setFriction(0.7);

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
  sector1.addPlayer(player);

  sector1.addEnemy(new Enemy(200, 200, 3, 1, entityId++));
}

function update() {
  handleInput();

  for (let sector of sectors) {
    sector.update();
  }

  player.update();
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  update();
}

init();
animate();