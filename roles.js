var func = {


  //**************
  // harvester role
  harvester: function(creep) {
    // states
    // s == 0 get energy
    // s == 1 store energy
    // s == 2 loiter *not implemented
    // s == 9 init new creep

    // a new creep inits
    if (creep.memory.s == 9) {
      creep.memory.s = 0;
    }
    // check if energy is 0
    if (creep.carry.energy == 0){
      creep.memory.s = 0;
    }
    // get energy
    if (creep.memory.s == 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
      if(creep.carry.energy == creep.carryCapacity){
        creep.memory.s = 1;
      }
    }
    // store energy carrying
    if (creep.memory.s == 1){
      // extension and spawns have 1st priority
      var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
              structure.energy < structure.energyCapacity;
      }});
      if (targets.length == 0){
        // towers have 2nd priority
        var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity;
        }});
      }
      if (targets.length == 0){
        // containers have 3nd priority
        var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER) &&
          _.sum(structure.store) < structure.storeCapacity;
        }});
      }
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  },


  //**************
  // builder role
  builder: function(creep) {
    if(creep.memory.s && creep.carry.energy == 0) {
      creep.memory.s = false;
    }

    if(!creep.memory.s && creep.carry.energy == creep.carryCapacity) {
      creep.memory.s = true;
    }

    if(creep.memory.s) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },


  //**************
  // upgrader role
  upgrader: function(creep) {
    if(creep.memory.s && creep.carry.energy == 0) {
      creep.memory.s = false;
    }
    if(!creep.memory.s && creep.carry.energy == creep.carryCapacity) {
      creep.memory.s = true;
    }
    if(creep.memory.s) {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    } else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },
  //**************
  // repairer role
  repairer: function(creep){
    // states
    // s == 0 get energy
    // s == 1 get new targets
    // s == 2 go repair target
    // s == 9 init new creep
    // t == 9 no target
    // t != 9 target

    // a new creep inits
    if (creep.memory.s == 9) {
      creep.memory.s = 0;
      creep.memory.t = 9;
    }
    // check if energy is 0
    if (creep.carry.energy == 0){
      creep.memory.s = 0;
      creep.memory.t = 9;
    }
    // get energy
    if (creep.memory.s == 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
      if(creep.carry.energy == creep.carryCapacity){
        creep.memory.s = 1;
      }
    }
    // check if energy is not 0 and t is 9
    if (creep.memory.s == 1 && creep.memory.t == 9){
      var targets = creep.room.find(FIND_STRUCTURES, {filter: function(structure) {
        if (structure.hits < structure.hitsMax){return structure;}
      }});
      targets.sort((x,y) => (((x.hits-x.hitsMax)/x.hitsMax)*100) - (((y.hits-y.hitsMax)/y.hitsMax)*100));
      if(targets.length) {
        creep.memory.t = targets[0].id;
        creep.memory.s = 2;
      }
    }
    // check if energy is not 0 and t is not 9
    if (creep.memory.s == 2 && creep.memory.t != 9){
      var target = Game.getObjectById(creep.memory.t);
      // check if current target is fully healed
      if (target.hits == target.hitsMax) {
        creep.memory.t = 9;
        creep.memory.s = 1;
      }else {
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }




    // if(creep.memory.s && creep.carry.energy == 0) {
    //   creep.memory.s = false;
    // }
    // if(!creep.memory.s && creep.carry.energy == creep.carryCapacity) {
    //   creep.memory.s = true;
    // }
    // if(creep.memory.s) {
    //   var targets = creep.room.find(FIND_STRUCTURES, {filter: function(structure) {
    //   if (structure.hits < structure.hitsMax){return structure;}}});
    //   targets.sort((x,y) => (((x.hits-x.hitsMax)/x.hitsMax)*100) - (((y.hits-y.hitsMax)/y.hitsMax)*100));
    //   if(targets.length) {
    //     if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
    //       creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
    //     }
    //   }
    // } else {
    //   var sources = creep.room.find(FIND_SOURCES);
    //   if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
    //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    //   }
    // }


  },
  //**************
  // hauler role
  hauler: function(creep){
    if(creep.memory.s && creep.carry.energy == 0) {
      creep.memory.s = false;
    }

    if(!creep.memory.s && creep.carry.energy == creep.carryCapacity) {
      creep.memory.s = true;
    }

    if(creep.memory.s) {
      var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_TOWER) &&
                  structure.esnergy < structure.energyCapacity;
        }
      });

        if(targets.length) {
          if(creep.transfer(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }
    } else {
      var sources = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
      return (structure.structureType == STRUCTURE_CONTAINER) &&
              structure.store[RESOURCE_ENERGY] > 0;
      }});
      if(creep.withdraw(sources[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
}
module.exports = func;
