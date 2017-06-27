// Utility Functions

//if input is higher than max or lower than min, return closest option
export function clamp(input, min, max){
  return Math.min(Math.max(input, min), max);
}

//does the two boxes intersect?
export function intersectBox(x0, y0, x1, y1, x2, y2, x3, y3) {
  return overlap(x0,x1,x2,x3) && overlap(y0,y1,y2,y3);
}

//find out if number-ranges overlap. Used to determine intersects
export function overlap(a0, a1, b0, b1) {
  return Math.min(a0,a1) <= Math.max(b0,b1) && Math.min(b0,b1) <= Math.max(a0,a1);
}

export function vcp(x0, y0, x1, y1) {
  return ((x0 * y1) - (x1 * y0));
}

export function pointSide(px, py, x0, y0, x1, y1) {
  return vcp((x1-x0), (y1-y0), (px-x0), (py-y0));
}

export function intersect(x1, y1, x2, y2, x3, y3, x4, y4){
  let pos = {};

  pos.x = vcp( vcp( x1,y1,x2,y2 ), ( x1 - x2 ), vcp(x3,y3,x4,y4) ,
      ( x3 - x4 )) / vcp( ( x1-x2 ),( y1-y2 ),( x3-x4 ),( y3-y4 ) );

  pos.y = vcp( vcp( x1,y1,x2,y2 ), ( y1 - y2 ), vcp(x3,y3,x4,y4) ,
      ( y3 - y4 )) / vcp( ( x1-x2 ),( y1-y2 ),( x3-x4 ),( y3-y4 ) );

  return pos;
}