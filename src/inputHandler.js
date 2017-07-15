var config = require('./util/config');
var Player = require('./objects/Player');

exports.handleInput = function () {
  let vecAddition = [ 0, 0 ], slower = false, back = false;

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
  } else if(slower) {
    vecAddition[0] = vecAddition[0] * config.movementPenalty;
    vecAddition[1] = vecAddition[1] * config.movementPenalty;
  }

  config.player.updatePos(vecAddition);
};