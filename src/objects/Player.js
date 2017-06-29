import config from '../util/config';
import * as vectorUtil from '../util/vector_util';
import Sector from './Sector';
import Bullet from './Bullet';

export default Player;

// Player
function Player(x, y, id) {
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.width = 15;
  this.height = 9;
  this.maxHp = config.playerMaxHp;
  this.hp = this.maxHp;
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
    return config.sectors.filter(sector => sector.id === this.currentSector)[0];
  };

  this.hit = function () {
    if (this.hp > 1) {
      this.hp--;
    } else {
      console.log('GAME OVER');
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
    config.c.translate( (this.x + this.width/2) - (this.width/2), (this.y + this.height/2) - (this.height/2));
    config.c.rotate(this.angle);
    config.c.fillStyle = 'black';
    config.c.rect(-this.width/2, -this.height/2, this.width, this.height);
    config.c.fill();
    config.c.stroke();
    config.c.closePath();
    config.c.restore();

    //HP bar over player
    config.c.beginPath();
    config.c.moveTo(this.x - this.width/2, this.y - this.height * 2.2);
    config.c.lineTo(this.x + (this.width/2), this.y - this.height * 2.2);
    config.c.strokeStyle = 'red';
    config.c.lineWidth = 3;
    config.c.stroke();
    config.c.closePath();
    config.c.lineWidth = 1;

    config.c.beginPath();
    config.c.moveTo(this.x - this.width/2, this.y - this.height * 2.2);
    config.c.lineTo(this.x  + ((this.width/this.maxHp) * this.hp) - this.width/2, this.y - this.height * 2.2);
    config.c.strokeStyle = 'green';
    config.c.lineWidth = 3;
    config.c.stroke();
    config.c.closePath();
    config.c.lineWidth = 1;
  };
}