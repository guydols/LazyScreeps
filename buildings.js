var exp = {


  //**************
  // Execute the jobs for tower
  towerJobs: function(tower) {
    if(tower) {
      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(closestHostile) {
        tower.attack(closestHostile);
        return;
      }
      if (tower.energy > 600){
        var targets = tower.room.find(FIND_STRUCTURES, {filter: function(structure) {
          if (structure.hits < structure.hitsMax &&
              structure.structureType != STRUCTURE_WALL &&
              structure.structureType != STRUCTURE_RAMPART){return structure;}
        }});
        if (targets.length > 0){
          targets.sort((x,y) => (((x.hits-x.hitsMax)/x.hitsMax)*100) - (((y.hits-y.hitsMax)/y.hitsMax)*100));
          if(targets[0]) {
            tower.repair(targets[0]);
          }
        } else {
          targets = tower.room.find(FIND_STRUCTURES, {filter: function(structure) {
            if (structure.structureType == STRUCTURE_WALL &&
                structure.hits < 1000000 ||
                structure.structureType == STRUCTURE_RAMPART &&
                structure.hits < 1000000){return structure;}
          }});
          targets.sort((x,y) => x.hits-y.hits);
          // console.log(JSON.stringify(targets));
          if(targets[0]) {
            tower.repair(targets[0]);
          }
        }
      }
    }
  },


  //**************
  //
  y: function() {

  },


  //**************
  //
  z: function() {

  }
};
module.exports = exp;
