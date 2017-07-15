var inputHandler = require('./inputHandler');
var Player = require('./objects/Player');
var Vertex = require('./objects/Vertex');
var Sector = require('./objects/Sector');
var Enemy = require('./objects/Enemy');
var config = require('./util/config');

config.socket = io();
config.socket.on('createPlayer', function(id) {
  config.player = new Player(150, 200, id);
  config.players.push(config.player);
  
  config.player.setSector(1);
  config.sectors[0].enterSector(config.player);
  
  config.socket.emit('addPlayers', JSON.stringify(config.player));
});

config.socket.on('init', function(data) {
  console.log('canvas', data);
});

config.socket.on('updatePlayers', function(data) {
  data = JSON.parse(data);
  let newPlayer = new Player(data.x, data.y, data.id);
  // Update rest of variables

  config.players.push(newPlayer)
});

config.socket.on('movePlayer', function(data) {
  let playerIndex = config.players.findIndex(i => i.id === data.id);

  if ( playerIndex !== -1) {
    let player = config.players[playerIndex];

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

  // let enemyVertex = sector4.randomVertex(config.enemyRadius);
  // console.log(enemyVertex.x, enemyVertex.y);
  // let enemy = new Enemy(enemyVertex.x, enemyVertex.y, 3, 4, config.entityId++);
  // config.enemies.push(enemy);
  // sector4.addEnemy(enemy);
}

// Update all objects
function update() {
  for (let sector of config.sectors) {
    sector.update();

    for (let effects of sector.effects) {
      effects.update();
    }
  }

  for (let enemy of config.enemies) {
    enemy.update();
  }

  if (config.player) {
    inputHandler.handleInput();
    config.player.update();
  }
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

  for (let player of config.players) {
    for (let bullet of player.bullets) {
      if (bullet.lifetime > 0) {
        bullet.draw();
      }
    }
    player.draw();
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