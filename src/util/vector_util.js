module.exports = {

// Utility Functions

//if input is higher than max or lower than min, return closest option
  clamp: function (input, min, max) {
    return Math.min(Math.max(input, min), max);
  },

//does the two boxes intersect?
  intersectBox: function (x0, y0, x1, y1, x2, y2, x3, y3) {
    return this.overlap(x0, x1, x2, x3) && this.overlap(y0, y1, y2, y3);
  },

//find out if number-ranges overlap. Used to determine intersects
  overlap: function (a0, a1, b0, b1) {
    return Math.min(a0, a1) <= Math.max(b0, b1) && Math.min(b0, b1) <= Math.max(a0, a1);
  },

  vcp: function (x0, y0, x1, y1) {
    return ((x0 * y1) - (x1 * y0));
  },

  pointSide: function (px, py, x0, y0, x1, y1) {
    return this.vcp((x1 - x0), (y1 - y0), (px - x0), (py - y0));
  },

  intersect: function (x1, y1, x2, y2, x3, y3, x4, y4) {
    let pos = {};

    pos.x = this.vcp(this.vcp(x1, y1, x2, y2), ( x1 - x2 ), this.vcp(x3, y3, x4, y4),
        ( x3 - x4 )) / this.vcp(( x1 - x2 ), ( y1 - y2 ), ( x3 - x4 ), ( y3 - y4 ));

    pos.y = this.vcp(this.vcp(x1, y1, x2, y2), ( y1 - y2 ), this.vcp(x3, y3, x4, y4),
        ( y3 - y4 )) / this.vcp(( x1 - x2 ), ( y1 - y2 ), ( x3 - x4 ), ( y3 - y4 ));

    return pos;
  }
};