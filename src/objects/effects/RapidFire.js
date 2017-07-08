import config from '../../util/config';
import * as util from '../../util/canvas-util';
import Sector from '../Sector';
import Player from '../Player';

export default RapidFire;

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
    for (let player of this.sector.players) {
      if (util.getDistance(player.x, player.y, this.x, this.y) < this.radius + player.height) {
        player.boostFire(this.effect, this.duration, this.fireDelay);
        this.removeEffect();
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