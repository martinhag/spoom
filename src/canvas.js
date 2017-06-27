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
const movementPenalty = 0.4;

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
    c.translate( (this.x + this.width/2) - (this.width/2), (this.y + this.height/2) - (this.height/2));
    c.rotate(this.angle);
    c.fillStyle = 'black';
    c.rect(-this.width/2, -this.height/2, this.width, this.height);
    c.fill();
    c.stroke();
    c.closePath();
    c.restore();
  };

  this.fire = function () {
    if (this.lastBullet >= this.bulletDelay) {
      this.bullets.push(
        new Bullet(
          this.x,
          this.y,
          (Math.cos(this.angle) + (this.x)) - (this.x),
          (Math.sin(this.angle) + (this.y)) - (this.y)
        )
      );
      this.lastBullet = 0;
    }
  };

  this.move = function (vecAddition) {
    this.x += vecAddition[0];
    this.y += vecAddition[1];
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
          if( (Math.min(a.x, b.x) > this.x+vecAddition[0] || this.x+vecAddition[0] > Math.max(a.x, b.x)) &&
            (Math.min(a.y, b.y) > this.y+vecAddition[1] || this.y+vecAddition[1] > Math.max(a.y, b.y))  ){
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
    return sectors.filter(sector => sector.id === this.currentSector)[0];
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

    if(this.lifetime > 0) {
      this.draw();
    }
  }

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = 'red';
    c.fill();
    c.closePath();
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
    for (let bullet of player.bullets) {
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
    return sectors.filter(sector => sector.id === this.sector)[0];
  };
}

// Implementation
let player = new Player(150, 100);

let enemys = [];
let sectors = [];

function handleInput() {
  let vecAddition = [ 0, 0 ];

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
  let vertices1 = [], vertices2 = [], vertices3 = [], vertices4 = [];
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

  let sector1 = new Sector(1, vertices1, 'red');
  let sector2 = new Sector(2, vertices2, 'blue');
  let sector3 = new Sector(3, vertices3, 'green');
  let sector4 = new Sector(4, vertices4, 'silver');

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

  for (let sector of sectors) {
    sector.draw();
  }

  for (let enemy of enemys) {
    enemy.update();
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