import * as inputHandler from './inputHandler';
import Player from './objects/Player';
import Vertex from './objects/Vertex';
import Sector from './objects/Sector';
import Enemy from './objects/Enemy';
import config from './util/config';

// // Initial Setup
config.canvas = document.querySelector('canvas');
config.c = config.canvas.getContext('2d');

config.canvas.width = innerWidth;
config.canvas.height = innerHeight;

config.player = new Player(150, 200, config.entityId++);

// Variables
let mouse = {
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

onkeydown = onkeyup = function(event){
  if(!config.commandKeys.indexOf(event.keyCode)) {
    event.preventDefault();
  }
  config.map[event.keyCode] = event.type == 'keydown';
};

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

  config.sectors.push(sector1);
  config.sectors.push(sector2);
  config.sectors.push(sector3);
  config.sectors.push(sector4);

  config.player.setSector(1);
  sector1.enterSector(config.player);

  // let enemyVertex = sector4.randomVertex(config.enemyRadius);
  // console.log(enemyVertex.x, enemyVertex.y);
  // let enemy = new Enemy(enemyVertex.x, enemyVertex.y, 3, 4, config.entityId++);
  // config.enemies.push(enemy);
  // sector4.addEnemy(enemy);
}

// Update all objects
function update() {
  inputHandler.handleInput();

  for (let sector of config.sectors) {
    sector.update();

    for (let effects of sector.effects) {
      effects.update();
    }
  }

  for (let enemy of config.enemies) {
    enemy.update();
  }

  config.player.update();
}

function draw() {
  config.c.save();
  // center "camera" over player
  config.c.translate(config.xView + config.canvas.width/2, config.yView + config.canvas.height/2);

  for (let sector of config.sectors) {
    sector.draw();

    for (let effects of sector.effects) {
      effects.draw();
    }
  }

  for (let enemy of config.enemies) {
    for (let bullet of enemy.bullets) {
      if (bullet.lifetime > 0) {
        bullet.draw();
      }
    }
    if (enemy.hp > 0) {
      enemy.draw();
    }
  }

  for (let bullet of config.player.bullets) {
    if (bullet.lifetime > 0) {
      bullet.draw();
    }
  }

  config.player.draw();

  config.c.restore();
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  config.c.clearRect(0, 0, config.canvas.width, config.canvas.height);

  update();
  draw();
}

init();
animate();