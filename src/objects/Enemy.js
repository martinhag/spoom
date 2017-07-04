import config from '../util/config';
import * as util from '../util/canvas-util';
import Sector from './Sector';
import Bullet from './Bullet';
import Player from './Player';

export default Enemy;

function Enemy(x, y, hp, sector, id) {
  this.x = x;
  this.y = y;
  this.color = 'yellow';
  this.radius = config.enemyRadius;
  this.id = id;

  this.attackDelay = 140;
  this.lastAttack = this.attackDelay;
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
      for (let player of this.getSector().players) {
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
  };

  this.attack = function () {
    let randomOffset = util.randomIntFromRange(-90, 90);

    for (let i = 0; i < this.numberOfBullets; i++) {
      let angle = (((360/this.numberOfBullets) * (i + 1) * Math.PI) / 180) + randomOffset;
      let speed = util.randomIntFromRange(2,4);

      this.bullets.push(
        new Bullet(
          this.x,
          this.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
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
    return config.sectors.filter(sector => sector.id === this.sector)[0];
  };
}