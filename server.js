var config = require('./src/util/config');
var Vertex = require('./src/objects/Vertex');
var Sector = require('./src/objects/Sector');
var Player = require('./src/objects/Player');

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);


app.set('port', 5000);
app.use('/dist', express.static(__dirname + '/dist'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'dist/index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
  init();
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
  io.to(socket.id).emit('createPlayer', socket.id);

  socket.on('addPlayers', function (data) {
    // Set rest of variables
    config.players.push(data);
    
    socket.broadcast.emit('updatePlayers', data);
  });
  
  socket.on('updatePlayer', function (data) {
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

    socket.broadcast.emit('movePlayer', data);
  });
});

setInterval(function() {
  // io.sockets.emit('message', 'hi!');
}, 1000);


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

  // config.player = new Player(150, 800, config.entityId++);
  // config.players.push(config.player);
  // config.player = new Player(0, 200, config.entityId++);
  // config.players.push(config.player);
  // config.player.setSector(1);
  // config.player.setSector(1);

  // let enemyVertex = sector4.randomVertex(config.enemyRadius);
  // console.log(enemyVertex.x, enemyVertex.y);
  // let enemy = new Enemy(enemyVertex.x, enemyVertex.y, 3, 4, config.entityId++);
  // config.enemies.push(enemy);
  // sector4.addEnemy(enemy);
}