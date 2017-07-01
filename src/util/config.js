export default {
  // Initial Setup
  canvas: null,
  c: null,
  xView: 280,
  yView: 170,
  
  // Active keys
  map: {},

  // Objects and arrays
  player: null,
  sectors: [],
  enemies: [],
  
  // Indexes
  entityId: 1,

  // Game values and arrays
  playerMaxHp: 5,
  moveSpeed: 3,
  movementPenalty: 0.6,
  backwordsSpeed: 0.3,
  angleAdjustments: 0.05,
  colors: [
    'black',
    'red',
    'blue',
    'grey'
  ],
  
  // Game setup
  commandKeys: [
    224, 
    17, 
    91
  ]
  
}